package com.example.eventpro.controller;

import com.example.eventpro.repository.PalestranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/palestrante")
public class Palestrante {

    @Autowired
    private PalestranteRepository palestranteRepository;

    @GetMapping
    public ResponseEntity<List<Palestrante>> listarTodos(){

        return ResponseEntity.ok(palestranteRepository.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Palestrante> criar(@RequestBody Palestrante palestrante){
        var palestranteBd = palestranteRepository.save(palestrante);
        return ResponseEntity.ok(palestranteBd);
    }



}
