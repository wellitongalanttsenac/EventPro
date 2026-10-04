package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.DTOs.palestrante.AtualizarPalestranteRequest;
import com.example.eventpro.application.DTOs.palestrante.CriarPalestranteRequest;
import com.example.eventpro.application.DTOs.palestrante.PalestranteResponse;
import com.example.eventpro.application.service.PalestranteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

// Regra de negócio central: o Organizador só gerencia Palestrantes dos Eventos que ele mesmo criou.
// O eventoId só aparece na rota quando é necessário (listar e criar), nas demais o palestrante já identifica o evento.
@RestController
@RequestMapping
@Tag(name = "Palestrantes", description = "Grupo de API responsável pela criação e consulta dos Palestrantes de um Evento")
public class PalestranteController {

    @Autowired
    private PalestranteService palestranteService;

    @GetMapping("/eventos/{eventoId}/palestrantes")
    @Operation(summary = "Método de consulta de lista de palestrantes de um evento", description = "Método responsável pela consulta de todos os palestrantes de um evento")
    public ResponseEntity<List<PalestranteResponse>> listarTodos(@PathVariable Long eventoId) {

        return ResponseEntity.ok(palestranteService.listarPalestrantesDoEvento(eventoId));

    }

    @GetMapping("palestrantes/{palestranteId}")
    @Operation(summary = "Método de consulta de palestrante por id", description = "Método responsável pela consulta de um palestrante por id")
    public ResponseEntity<PalestranteResponse> buscarPorId(@PathVariable Long palestranteId) {

        PalestranteResponse palestranteBanco = palestranteService.buscarPalestrantePorId(palestranteId);

        return ResponseEntity.ok(palestranteBanco);
    }

    @PostMapping("/eventos/{eventoId}/palestrantes")
    @Operation(summary = "Método de criação de palestrante", description = "Método responsável pela criação de um palestrante vinculado a um evento. Somente o organizador dono do evento pode cadastrar")
    public ResponseEntity<PalestranteResponse> criar(@PathVariable Long eventoId, @RequestParam Long organizadorId, @RequestBody CriarPalestranteRequest palestranteRequest) {

        PalestranteResponse palestranteCriadoBanco = palestranteService.criarPalestrante(eventoId, organizadorId, palestranteRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(palestranteCriadoBanco);
    }

    @PutMapping("palestrantes/{palestranteId}")
    @Operation(summary = "Método de alterar informações do palestrante", description = "Método responsável pela alteração de palestrantes. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<PalestranteResponse> atualizarPalestrante(@PathVariable Long palestranteId, @RequestParam Long organizadorId, @RequestBody AtualizarPalestranteRequest palestranteRequest) {

        PalestranteResponse palestranteAlteradoBanco = palestranteService.atualizarPalestrante(palestranteId, organizadorId, palestranteRequest);

        return ResponseEntity.ok(palestranteAlteradoBanco);
    }

    @DeleteMapping("/{palestranteId}/excluir")
    @Operation(summary = "Método de exclusão de palestrante", description = "Método responsável pela exclusão de um palestrante. Somente o organizador dono do evento pode excluir")
    public ResponseEntity<Void> excluir(@PathVariable Long palestranteId, @RequestParam Long organizadorId) {

        palestranteService.excluirPalestrantePorId(palestranteId, organizadorId);

        return ResponseEntity.ok().build();
    }
}
