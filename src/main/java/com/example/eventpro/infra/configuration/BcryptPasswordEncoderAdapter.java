// Camada INFRA: implementações concretas que dependem de biblioteca externa.
package com.example.eventpro.infra.configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.eventpro.application.ports.PasswordEncoderPort;

/*
 * ADAPTER do BCrypt: implementa a porta PasswordEncoderPort usando o BCryptPasswordEncoder do Spring Security.
 *
 * Padrão Ports and Adapters: a aplicação define a porta (interface), a infra pluga o adaptador.
 * O Spring injeta esta classe onde alguém pede um PasswordEncoderPort (AuthService, UsuarioService).
 *
 * BCrypt: algoritmo de hash próprio para senha. Gera um "salt" aleatório a cada encode,
 * por isso a mesma senha gera hashes diferentes e a comparação precisa ser feita com matches().
 */
@Component // Vira um bean do Spring.
public class BcryptPasswordEncoderAdapter implements PasswordEncoderPort {

    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean verifyPassword(CharSequence rawPassord, String encryptedPassword) {
        return bcrypt.matches(rawPassord, encryptedPassword);
    }

}
