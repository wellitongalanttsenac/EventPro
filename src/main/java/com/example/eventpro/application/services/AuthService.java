// Camada APPLICATION: casos de uso de autenticação.
package com.example.eventpro.application.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.eventpro.application.dto.auth.LoginRequest;
import com.example.eventpro.application.dto.auth.LoginResponse;
import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.application.dto.usuario.EsqueciSenhaRequest;
import com.example.eventpro.application.dto.usuario.EsqueciSenhaResponse;
import com.example.eventpro.application.dto.usuario.RedefinirSenhaRequest;
import com.example.eventpro.application.ports.PasswordEncoderPort;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.InvalidCredentialsException;
import com.example.eventpro.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/*
 * SERVICE de Autenticação.
 *
 * Na referência, o login e o getUsuarioLogado() ficam dentro do UsuarioService.
 * No EventPro eles foram separados aqui (SRP - Princípio da Responsabilidade Única):
 *  - UsuarioService cuida do CADASTRO de organizadores;
 *  - AuthService cuida de QUEM está logado (login, senha, usuário da requisição).
 *
 * Com quem conversa:
 *  - AuthController (camada presentation) chama login / esqueci senha / redefinir senha.
 *  - EventoService chama getUsuarioLogado() para aplicar a regra do dono do evento.
 *  - TokenService gera e valida o JWT.
 *  - UsuarioRepository busca o organizador no banco.
 *  - PasswordEncoderPort compara/criptografa senha (sem saber que por trás é BCrypt -> DIP).
 */
@Service
@RequiredArgsConstructor // Gera o construtor com os 3 campos final abaixo (injeção por construtor).
public class AuthService {

    private final TokenService tokenService;

    private final UsuarioRepository usuarioRepository;

    // Depende da INTERFACE (porta), não do BCrypt direto -> SOLID DIP.
    private final PasswordEncoderPort passwordEncoder;

    // POST /auth/login
    public LoginResponse autenticarOrganizador(LoginRequest loginRequest) {

        // 1) Busca o organizador pelo e-mail (Optional, pode não existir).
        // 2) .filter mantém o usuário só se a senha digitada bater com o hash BCrypt salvo.
        //    (O BCrypt gera um hash diferente a cada vez, por isso não dá para comparar direto no banco
        //     como a referência faz com existsUsuarioByEmailAndSenha.)
        // 3) Se não sobrou ninguém, lança InvalidCredentialsException (vira 401 no GlobalExceptionHandler).
        Usuario usuarioBanco = usuarioRepository
                .findByEmail(loginRequest.email())
                .filter(usuario -> passwordEncoder.verifyPassword(loginRequest.senha(), usuario.getSenha()))
                .orElseThrow(() -> new InvalidCredentialsException("Usuario ou senha invalidos!"));

        // Gera o JWT e já salva na tabela token (ver TokenService).
        var tokenAutenticacao = tokenService.gerarToken(usuarioBanco);
        return new LoginResponse(tokenAutenticacao);
    }

    // POST /auth/esqueci-senha
    public EsqueciSenhaResponse gerarTokenRecuperacaoDeSenha(EsqueciSenhaRequest esqueciSenhaRequest) {

        Usuario usuarioBanco = buscarUsuarioPorEmail(esqueciSenhaRequest.email());

        // Em um cenario de producao esse token seria enviado por e-mail ao organizador
        var tokenRecuperacao = tokenService.gerarToken(usuarioBanco);
        return new EsqueciSenhaResponse(tokenRecuperacao);
    }

    // PATCH /auth/redefinir-senha
    public void redefinirSenhaPorToken(RedefinirSenhaRequest redefinirSenhaRequest) {

        // O token diz de quem é a conta; quem manda o token não escolhe o usuário.
        UsuarioLogado donoDoToken = verificarTokenRecuperacao(redefinirSenhaRequest.token());

        Usuario usuarioBanco = buscarUsuarioPorEmail(donoDoToken.email());

        // A nova senha também é salva criptografada.
        usuarioBanco.setSenha(passwordEncoder.encode(redefinirSenhaRequest.novaSenha()));
        usuarioRepository.save(usuarioBanco);
    }

    // Igual ao getUsuarioLogado() da referência.
    // O JwtFilter colocou o UsuarioLogado no SecurityContextHolder no início da requisição;
    // aqui só lemos de volta. getPrincipal() devolve Object, por isso o cast.
    public UsuarioLogado getUsuarioLogado() {
        return (UsuarioLogado) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // Converte as falhas de token (assinatura/expiração ou token que não está no banco) em 401.
    private UsuarioLogado verificarTokenRecuperacao(String tokenRecuperacao) {

        try {
            return tokenService.verificarToken(tokenRecuperacao);
        } catch (JWTVerificationException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invalido ou expirado!");
        }
    }

    // Busca reaproveitada pelos métodos acima; sem usuário -> 404.
    private Usuario buscarUsuarioPorEmail(String email) {

        return usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));
    }
}
