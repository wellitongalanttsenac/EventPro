package com.example.eventpro.presentation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventpro.application.DTOs.auth.LoginRequest;
import com.example.eventpro.application.DTOs.auth.LoginResponse;
import com.example.eventpro.application.DTOs.usuario.EsqueciSenhaRequest;
import com.example.eventpro.application.DTOs.usuario.EsqueciSenhaResponse;
import com.example.eventpro.application.DTOs.usuario.RedefinirSenhaRequest;
import com.example.eventpro.application.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Grupo de API responsável pelo login e recuperação de senha dos Organizadores")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Autenticação de organizadores", description = "Método de login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        LoginResponse loginAutenticado = authService.autenticarOrganizador(loginRequest);

        return ResponseEntity.ok(loginAutenticado);
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Solicitar recuperação de senha", description = "Método responsável por gerar um token de redefinição de senha a partir do e-mail informado. Em um cenário de produção esse token seria enviado por e-mail ao organizador")
    public ResponseEntity<EsqueciSenhaResponse> esqueciSenha(@RequestBody EsqueciSenhaRequest esqueciSenhaRequest) {

        EsqueciSenhaResponse tokenRecuperacaoGerado = authService.gerarTokenRecuperacaoDeSenha(esqueciSenhaRequest);

        return ResponseEntity.ok(tokenRecuperacaoGerado);
    }

    @PatchMapping("/redefinir-senha")
    @Operation(summary = "Redefinir senha esquecida", description = "Método responsável por trocar a senha do organizador a partir do token gerado em /auth/esqueci-senha")
    public ResponseEntity<Void> redefinirSenha(@RequestBody RedefinirSenhaRequest redefinirSenhaRequest) {

        authService.redefinirSenhaPorToken(redefinirSenhaRequest);

        return ResponseEntity.ok().build();
    }
}
