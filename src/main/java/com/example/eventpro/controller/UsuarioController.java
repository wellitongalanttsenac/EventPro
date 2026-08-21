package com.example.eventpro.controller;

import com.example.eventpro.entities.Usuario;
import com.example.eventpro.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Grupo de api responsavel a estruturar de criação e consultade usuarios do sistema")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    @Operation(summary = "metodo de consulta de lista de usuario", description = "Metodo responsavel pela consulta de todos os usuarios sem filtros")
    public ResponseEntity<?> listarTodos(){

        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "metodo para ciração de usuario", description = "Metodo responsavel pela criação de usuarios")
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario){
        var usuarioBd = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioBd);
    }



}
