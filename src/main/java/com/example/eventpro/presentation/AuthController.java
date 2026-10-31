// Camada PRESENTATION: entrada HTTP da autenticação.
package com.example.eventpro.presentation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventpro.application.dto.auth.LoginRequest;
import com.example.eventpro.application.dto.auth.LoginResponse;
import com.example.eventpro.application.dto.usuario.EsqueciSenhaRequest;
import com.example.eventpro.application.dto.usuario.EsqueciSenhaResponse;
import com.example.eventpro.application.dto.usuario.RedefinirSenhaRequest;
import com.example.eventpro.application.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/*
 * CONTROLLER de Autenticação (igual ao AuthController da referência, mais a recuperação de senha).
 * As 3 rotas daqui são PÚBLICAS (liberadas no JwtFilter e na SecurityConfiguration),
 * porque quem chama ainda não tem token.
 *
 * Diferença para a referência: lá o controller faz "if (resultado != null) ok else badRequest".
 * Aqui o service lança InvalidCredentialsException e o GlobalExceptionHandler responde 401,
 * deixando o controller só com o caminho feliz.
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Grupo de API responsável pelo login e recuperação de senha dos Organizadores")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login") // POST /auth/login
    @Operation(summary = "Autenticação de organizadores", description = "Método de login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        LoginResponse loginAutenticado = authService.autenticarOrganizador(loginRequest);

        return ResponseEntity.ok(loginAutenticado); // 200 + {"token": "..."}
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
