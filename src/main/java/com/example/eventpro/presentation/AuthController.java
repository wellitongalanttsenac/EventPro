package com.example.eventpro.controller;

import com.example.eventpro.DTOs.EsqueciSenhaRequest;
import com.example.eventpro.DTOs.EsqueciSenhaResponse;
import com.example.eventpro.DTOs.LoginRequest;
import com.example.eventpro.DTOs.LoginResponse;
import com.example.eventpro.DTOs.RedefinirSenhaRequest;
import com.example.eventpro.entities.Usuario;
import com.example.eventpro.repository.UsuarioRepository;
import com.example.eventpro.service.TokenService;
import com.auth0.jwt.exceptions.JWTVerificationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.HttpURLConnection;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Grupo de API responsável pelo login e recuperação de senha dos Organizadores")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Autenticação de organizadores", description = "Método de login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        if (usuarioRepository.existsUsuarioByEmailAndSenha(loginRequest.email(), loginRequest.senha())) {

            var token = tokenService.geraToken(loginRequest.email());

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(HttpURLConnection.HTTP_UNAUTHORIZED).body("Usuário ou senha inválidos!");
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Solicitar recuperação de senha", description = "Método responsável por gerar um token de redefinição de senha a partir do e-mail informado. Em um cenário de produção esse token seria enviado por e-mail ao organizador")
    public ResponseEntity<?> esqueciSenha(@RequestBody EsqueciSenhaRequest request) {

        Usuario usuarioBanco = usuarioRepository.findByEmail(request.email()).orElse(null);

        if (usuarioBanco == null) {
            return ResponseEntity.notFound().build();
        }

        var tokenRecuperacao = tokenService.geraToken(usuarioBanco.getEmail());

        return ResponseEntity.ok(new EsqueciSenhaResponse(tokenRecuperacao));
    }

    @PatchMapping("/redefinir-senha")
    @Operation(summary = "Redefinir senha esquecida", description = "Método responsável por trocar a senha do organizador a partir do token gerado em /auth/esqueci-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinirSenhaRequest request) {

        try {
            var jwtValidado = tokenService.verificadorToken(request.token());
            String email = jwtValidado.getSubject();

            Usuario usuarioBanco = usuarioRepository.findByEmail(email).orElse(null);

            if (usuarioBanco == null) {
                return ResponseEntity.notFound().build();
            }

            usuarioBanco.setSenha(request.novaSenha());
            usuarioRepository.save(usuarioBanco);

            return ResponseEntity.ok().build();

        } catch (JWTVerificationException e) {
            return ResponseEntity.status(HttpURLConnection.HTTP_UNAUTHORIZED).body("Token inválido ou expirado!");
        }
    }
}
