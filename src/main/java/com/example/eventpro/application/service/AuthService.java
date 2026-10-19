package com.example.eventpro.application.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.eventpro.application.DTOs.auth.LoginRequest;
import com.example.eventpro.application.DTOs.auth.LoginResponse;
import com.example.eventpro.application.DTOs.usuario.EsqueciSenhaRequest;
import com.example.eventpro.application.DTOs.usuario.EsqueciSenhaResponse;
import com.example.eventpro.application.DTOs.usuario.RedefinirSenhaRequest;
import com.example.eventpro.application.ports.PasswordEncoderPort;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.InvalidCredentialsException;
import com.example.eventpro.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class AuthService {

    private final TokenService tokenService;

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoderPort passwordEncoder;

    public LoginResponse autenticarOrganizador(LoginRequest loginRequest) {

        // A senha fica salva com BCrypt, entao a comparacao e feita pelo encoder e nao direto no banco
        boolean credenciaisValidas = usuarioRepository
        .findByEmail(loginRequest.email())
        .map(usuarioBanco -> passwordEncoder.verifyPassword(loginRequest.senha(), usuarioBanco.getSenha()))
        .orElse(false);

        if (!credenciaisValidas) {
            throw new InvalidCredentialsException("Usuario ou senha invalidos!");
        }

        var tokenAutenticacao = tokenService.geraToken(loginRequest.email());
        return new LoginResponse(tokenAutenticacao);
    }

    public EsqueciSenhaResponse gerarTokenRecuperacaoDeSenha(EsqueciSenhaRequest esqueciSenhaRequest) {

        Usuario usuarioBanco = buscarUsuarioPorEmail(esqueciSenhaRequest.email());

        // Em um cenario de producao esse token seria enviado por e-mail ao organizador
        var tokenRecuperacao = tokenService.geraToken(usuarioBanco.getEmail());
        return new EsqueciSenhaResponse(tokenRecuperacao);
    }

    public void redefinirSenhaPorToken(RedefinirSenhaRequest redefinirSenhaRequest) {

        String emailDoToken = extrairEmailDoTokenRecuperacao(redefinirSenhaRequest.token());

        Usuario usuarioBanco = buscarUsuarioPorEmail(emailDoToken);

        usuarioBanco.setSenha(passwordEncoder.encode(redefinirSenhaRequest.novaSenha()));
        usuarioRepository.save(usuarioBanco);
    }

    private String extrairEmailDoTokenRecuperacao(String tokenRecuperacao) {

        try {
            return tokenService.verificadorToken(tokenRecuperacao).getSubject();
        } catch (JWTVerificationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invalido ou expirado!");
        }
    }

    private Usuario buscarUsuarioPorEmail(String email) {

        return usuarioRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));
    }
}
