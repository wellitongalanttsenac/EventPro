package com.example.eventpro.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${spring.secret}")
    private String secret;
    @Value("${spring.expiration}")
    private Long expiration;
    @Value("${spring.emissor}")
    private String emissor;

    public String geraToken(String subject){
        try{

            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(subject)
                    .withExpiresAt(getDataExpiracao())
                    .sign(algorithm)
                    ;

            return token;


        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    private Instant getDataExpiracao(){
        // Pegar data atual
        var dataAtual = LocalDateTime.now();
        // Aumanetar ou diminuir a data a partir da atual
        var dataFuturo = dataAtual.plusMinutes(expiration);

        return dataFuturo.toInstant(ZoneOffset.of("-83:00"));


    }


}
