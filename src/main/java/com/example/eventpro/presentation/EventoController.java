package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.DTOs.evento.AtualizarEventoRequestDTO;
import com.example.eventpro.application.DTOs.evento.AtualizarStatusEventoRequest;
import com.example.eventpro.application.DTOs.evento.CriarEventoRequest;
import com.example.eventpro.application.DTOs.evento.EventoResponse;
import com.example.eventpro.application.service.EventoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "Grupo de API responsável pela criação e consulta dos Eventos do sistema")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    @Operation(summary = "Método de consulta de lista de eventos", description = "Método responsável pela consulta de todos os eventos sem filtros")
    public ResponseEntity<List<EventoResponse>> listarTodos() {

        return ResponseEntity.ok(eventoService.listarTodosOsEventos());

    }

    @GetMapping("/{eventoId}")
    @Operation(summary = "Método de consulta de evento por id", description = "Método responsável pela consulta de um evento por id")
    public ResponseEntity<EventoResponse> buscarPorId(@PathVariable Long eventoId) {

        EventoResponse eventoBanco = eventoService.buscarEventoPorId(eventoId);

        return ResponseEntity.ok(eventoBanco);
    }

    @PostMapping
    @Operation(summary = "Método de criação de evento", description = "Método responsável pela criação de um evento. O organizadorId informado se torna o dono do evento")
    public ResponseEntity<EventoResponse> criar(@RequestBody CriarEventoRequest eventoRequest) {

        EventoResponse eventoCriadoBanco = eventoService.criarEvento(eventoRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(eventoCriadoBanco);
    }

    @PatchMapping("/{eventoId}/status")
    @Operation(summary = "Método de alterar Status", description = "Método responsável pela alteração dos status dos eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long eventoId, @RequestParam Long organizadorId, @RequestBody AtualizarStatusEventoRequest statusRequest) {

        eventoService.atualizarStatusEvento(eventoId, organizadorId, statusRequest);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{eventoId}")
    @Operation(summary = "Método de alterar informações do evento", description = "Método responsável pela alteração de eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<EventoResponse> atualizarEvento(@PathVariable Long eventoId, @RequestParam Long organizadorId, @RequestBody AtualizarEventoRequestDTO eventoRequest) {

        EventoResponse eventoAlteradoBanco = eventoService.atualizarEvento(eventoId, organizadorId, eventoRequest);

        return ResponseEntity.ok(eventoAlteradoBanco);
    }

    @DeleteMapping("/{eventoId}/excluir")
    @Operation(summary = "Método de cancelamento de evento", description = "Método responsável pelo cancelamento do evento. Somente o organizador dono do evento pode excluir")
    public ResponseEntity<Void> cancelar(@PathVariable Long eventoId, @RequestParam Long organizadorId) {

        eventoService.cancelarEventoPorId(eventoId, organizadorId);

        return ResponseEntity.ok().build();
    }
}
