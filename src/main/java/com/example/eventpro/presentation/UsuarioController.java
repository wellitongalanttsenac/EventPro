package com.example.eventpro.presentation;

import com.example.eventpro.application.DTOs.usuario.AtualizarStatusUsuarioRequest;
import com.example.eventpro.application.DTOs.usuario.AtualizarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.UsuarioResponse;
import com.example.eventpro.application.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Grupo de API responsável pela estrutura de criação e consulta dos Organizadores do sistema")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Método de consulta de lista de organizadores", description = "Método responsável pela consulta de todos os organizadores sem filtros")
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {

        return ResponseEntity.ok(usuarioService.listarTodosOsUsuarioParaGrid());

    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de consulta de organizador por id", description = "Método responsável pela consulta de um organizador por id")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {

        UsuarioResponse usuarioBanco = usuarioService.buscarUsuarioPorId(id);
       
        return ResponseEntity.ok(usuarioBanco);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Método para criação de organizador", description = "Método responsável pela criação de organizadores")
    public ResponseEntity<UsuarioResponse> criar(@RequestBody CriarUsuarioRequestDTO usuario) {

        var usuarioCriadoBanco = usuarioService.criarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriadoBanco);

    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Método de alterar Status", description = "Método responsável pela alteração dos status dos organizadores")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusUsuarioRequest statusRequest) {

        usuarioService.atualizarStatusUsuario(id, statusRequest);
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Método de alterar informações do organizador", description = "Método responsável pela alteração de organizadores")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(@PathVariable Long id, @RequestBody AtualizarUsuarioRequestDTO usuarioRequest) {

        UsuarioResponse usuarioAlteradoBanco = usuarioService.atualizarUsuario(id, usuarioRequest);

        return ResponseEntity.ok(usuarioAlteradoBanco);

        

    }

//     @DeleteMapping("/{id}/excluir")
//     @Operation(summary = "Método de inativação de cadastro", description = "Método responsável pela inativação do cadastro do organizador")
//     public ResponseEntity<Void> excluir(@PathVariable Long id) {

//         Usuario usuarioBanco = usuarioRepository.findById(id).orElse(null);
//         if (usuarioBanco != null) {
//             usuarioBanco.setStatus(EnumStatus.EXCLUIDO);
//             usuarioRepository.save(usuarioBanco);
//             return ResponseEntity.ok().build();
//         }
//         return ResponseEntity.notFound().build();
//     }
}
