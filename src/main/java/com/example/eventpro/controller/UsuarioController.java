package com.example.eventpro.controller;

import com.example.eventpro.entities.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @GetMapping
    public ResponseEntity<?> listarTodos(){
        List<Usuario> usuarios = List.of(new Usuario(1L, "Samuel", "123456789123", "1234", "samuel@matos.com"));
        return ResponseEntity.ok(usuarios);
    }

}
