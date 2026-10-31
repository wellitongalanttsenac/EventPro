// Camada APPLICATION: os services orquestram os casos de uso (regras de aplicação).
package com.example.eventpro.application.services;

// Biblioteca java-jwt (auth0): cria, assina e valida os tokens JWT.
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.domain.entities.Token;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.TokenRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/*
 * SERVICE de Token (igual à referência do professor)
 *
 * Responsabilidade única (SRP): tudo que é JWT fica aqui. Gerar e verificar.
 *
 * Com quem conversa:
 *  - AuthService chama gerarToken(...) no login e no "esqueci a senha".
 *  - JwtFilter chama verificarToken(...) em TODA requisição protegida.
 *  - AuthService chama verificarToken(...) na redefinição de senha.
 *  - TokenRepository para salvar e consultar o token no banco.
 *
 * O que é um JWT: um texto em 3 partes "cabecalho.conteudo.assinatura".
 * O conteúdo (claims) guarda quem emitiu (issuer), de quem é (subject = e-mail) e quando expira.
 * A assinatura é feita com a nossa chave secreta: se alguém alterar o conteúdo, a assinatura não bate.
 */
@Service                    // Registra a classe como bean do Spring (ele cria e injeta onde precisar).
@RequiredArgsConstructor    // Lombok: gera o construtor com os campos "final" -> injeção de dependência pelo construtor.
public class TokenService {

    // @Value lê do application.properties. A mesma chave assina o JWT
    // e libera a criação de admin pelo desktop (igual à referência).
    @Value("${spring.secretkey}")
    private String secret;

    // Minutos de validade do token.
    @Value("${spring.tempo_expiracao}")
    private Long tempo;

    // "Quem emitiu" o token. Na verificação exigimos esse mesmo emissor.
    private String emissor = "EVENTPRO";

    // Injetado pelo construtor (final = não pode ser trocado depois).
    private final TokenRepository tokenRepository;

    // Gera o JWT do usuário e SALVA no banco (tabela token), ligando o token ao dono.
    public String gerarToken(Usuario usuario) {

        // HMAC256 = algoritmo de assinatura simétrica: a mesma chave assina e verifica.
        Algorithm algorithm = Algorithm.HMAC256(secret);

        String token = JWT.create()
                .withIssuer(emissor)                    // claim "iss": quem emitiu.
                .withSubject(usuario.getEmail())        // claim "sub": de quem é o token.
                .withExpiresAt(this.gerarDataExpiracao()) // claim "exp": até quando vale.
                .sign(algorithm);                       // Assina e transforma em texto.

        // Persistimos para depois saber de quem é o token e garantir que foi emitido por nós.
        tokenRepository.save(new Token(token, usuario));

        return token;
    }

    // Valida o token e devolve quem é o usuário logado.
    // "throws" documenta que pode lançar JWTVerificationException (assinatura errada, expirado, emissor diferente).
    public UsuarioLogado verificarToken(String token) throws JWTVerificationException {

        Algorithm algorithm = Algorithm.HMAC256(secret);

        // Monta o verificador exigindo o mesmo algoritmo/chave e o mesmo emissor.
        JWTVerifier verificador = JWT.require(algorithm).withIssuer(emissor).build();

        // 1ª barreira: assinatura e validade. Se falhar, lança exceção e para aqui.
        verificador.verify(token);

        // 2ª barreira: o token precisa existir no banco (foi emitido por um login desta API).
        var tokenBanco = tokenRepository.findTokenByToken(token).orElse(null);

        if (tokenBanco == null) {
            throw new IllegalArgumentException("Token Invalido!");
        }

        // Transforma o dono do token no DTO que vai para o SecurityContextHolder.
        return new UsuarioLogado(tokenBanco.getUsuario());
    }

    // Data de expiração = agora + "tempo" minutos, no fuso de Brasília (-03:00).
    private Instant gerarDataExpiracao() {
        var dataAtual = LocalDateTime.now();
        dataAtual = dataAtual.plusMinutes(tempo);

        return dataAtual.toInstant(ZoneOffset.of("-03:00"));
    }
}
