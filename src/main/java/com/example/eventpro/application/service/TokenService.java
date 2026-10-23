package com.example.eventpro.application.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.eventpro.application.DTOs.usuario.UsuarioLogado;
import com.example.eventpro.domain.entities.Token;
import com.example.eventpro.domain.repository.TokenRepository;
import com.example.eventpro.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.tempo_expiracao}")
    private Long tempo;

    private String emissor = "EVENTPRO";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRepository tokenRepository;

    public String geraToken(String subject){
        try{

            Algorithm algorithm = Algorithm.HMAC256(secret);

            var usuario = usuarioRepository.findAll()
                    .stream().filter( u-> u.getEmail().equals(loginResquestDto.email()))
                    .findFirst().orElse(null);

            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(subject)
                    .withExpiresAt(getDataExpiracao())
                    .sign(algorithm)
                    ;

            tokenRepository.save(new Token(token,usuario));

            return token;


        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    public DecodedJWT verificadorToken(String token) throws JWTVerificationException {

        Algorithm algorithm = Algorithm.HMAC256(secret);

        JWTVerifier verificador = JWT.require(algorithm).withIssuer(emissor).build();

        var tokenBanco = tokenRepository.findTokenBytoken(token).orElse(null);

        if(tokenBanco == null){
            throw new IllegalArgumentException("Token invalido");
        }

        return new UsuarioLogado(tokenBanco.getUsuario());

    }


    private Instant getDataExpiracao(){
        // Pegar data atual
        var dataAtual = LocalDateTime.now();
        // Aumanetar ou diminuir a data a partir da atual
        var dataFuturo = dataAtual.plusMinutes(tempo);

        return dataFuturo.toInstant(ZoneOffset.of("-03:00"));


    }
}
