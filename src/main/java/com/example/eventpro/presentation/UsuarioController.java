// Camada PRESENTATION: entrada HTTP dos organizadores (usuários).
package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.dto.usuario.AtualizarStatusUsuarioRequest;
import com.example.eventpro.application.dto.usuario.AtualizarUsuarioRequestDTO;
import com.example.eventpro.application.dto.usuario.CriarAdminRequest;
import com.example.eventpro.application.dto.usuario.CriarAdminResponse;
import com.example.eventpro.application.dto.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.application.dto.usuario.UsuarioResponse;
import com.example.eventpro.application.services.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/*
 * CONTROLLER de Usuarios (mesmas rotas do UsuarioController da referência).
 * Todas exigem token, menos o POST /usuarios/admin, que o desktop chama sem login
 * (protegido pela secretKey).
 */
@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Grupo de API responsável pela estrutura de criação e consulta dos Organizadores do sistema")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/admin")
    @Operation(summary = "Método para criação de admin", description = "Método usado pelo desktop para criar um admin. Exige a secretKey configurada na API")
    public ResponseEntity<CriarAdminResponse> criarAdmin(@RequestBody CriarAdminRequest criarAdminRequest) {

        // Chave invalida vira 403 no GlobalExceptionHandler
        CriarAdminResponse respostaSalvar = usuarioService.criarAdmin(criarAdminRequest);
        return ResponseEntity.ok(respostaSalvar);
    }

    @GetMapping
    @Operation(summary = "Método de consulta de lista de organizadores", description = "Método responsável pela consulta de todos os organizadores sem filtros")
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {

        return ResponseEntity.ok(usuarioService.listarTodosOsUsuarioParaGrid());
    }

    @GetMapping("/buscarusuariologado")
    @Operation(summary = "Usuario Logado", description = "Método responsável pela consulta do organizador dono do token")
    public ResponseEntity<UsuarioResponse> buscarUsuarioLogado() {

        return ResponseEntity.ok(usuarioService.buscarUsuarioLogado());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de consulta de organizador por id", description = "Método responsável pela consulta de um organizador por id")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {

        UsuarioResponse usuarioBanco = usuarioService.buscarUsuarioPorId(id);

        return ResponseEntity.ok(usuarioBanco);
    }

    @PostMapping
    @Operation(summary = "Método para criação de organizador", description = "Método responsável pela criação de organizadores")
    public ResponseEntity<UsuarioResponse> criar(@RequestBody CriarUsuarioRequestDTO usuario) {

        var usuarioCriadoBanco = usuarioService.criarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriadoBanco); // 201
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Método de alterar Status", description = "Método responsável pela alteração dos status dos organizadores")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusUsuarioRequest statusRequest) {

        usuarioService.atualizarStatusUsuario(id, statusRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Método de alterar informações do organizador", description = "Método responsável pela alteração de organizadores")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(@PathVariable Long id, @RequestBody AtualizarUsuarioRequestDTO usuarioRequest) {

        UsuarioResponse usuarioAlteradoBanco = usuarioService.atualizarUsuario(id, usuarioRequest);

        return ResponseEntity.ok(usuarioAlteradoBanco);
    }

    @DeleteMapping("/{id}/excluir")
    @Operation(summary = "Método de inativação de cadastro", description = "Método responsável pela inativação do cadastro do organizador")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        usuarioService.excluirUsuarioPorId(id);

        return ResponseEntity.ok().build();
    }
}
