package com.example.eventpro.infra.configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.eventpro.application.ports.PasswordEncoderPort;

// Implementando o contratp da Interface utilizando o implements
@Component 
public class BcryptPasswordEncoderAdapter implements PasswordEncoderPort{

    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    @Override 
    public String encode(CharSequence rawPassword){
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean verifyPassword(CharSequence rawPassord, String encryptedPassword){
        return bcrypt.matches(encryptedPassword, encryptedPassword);
    }

}
