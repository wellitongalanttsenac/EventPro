// Camada PRESENTATION: a "porta de entrada" HTTP. Recebe a requisição, chama o service e devolve a resposta.
package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.dto.evento.AtualizarEventoRequestDTO;
import com.example.eventpro.application.dto.evento.AtualizarStatusEventoRequest;
import com.example.eventpro.application.dto.evento.CriarEventoRequest;
import com.example.eventpro.application.dto.evento.EventoResponse;
import com.example.eventpro.application.services.EventoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/*
 * CONTROLLER de Eventos.
 *
 * Clean Architecture: o controller NÃO tem regra de negócio. Ele só:
 *  1. recebe o HTTP (rota, path variable, corpo JSON -> DTO);
 *  2. chama o EventoService;
 *  3. devolve o status HTTP + DTO de resposta.
 * Erros (404, 403, 400) são lançados pelo service e convertidos pelo GlobalExceptionHandler.
 *
 * Todas as rotas daqui exigem token (SecurityConfiguration). O organizador dono do evento
 * é descoberto pelo token dentro do service, por isso não existe parâmetro organizadorId.
 */
@RestController             // Controller REST: o retorno dos métodos vira JSON.
@RequestMapping("/eventos") // Prefixo de todas as rotas da classe.
@Tag(name = "Eventos", description = "Grupo de API responsável pela criação e consulta dos Eventos do sistema") // Agrupa no Swagger.
public class EventoController {

    @Autowired // Injeção por campo, igual aos controllers da referência.
    private EventoService eventoService;

    @GetMapping // GET /eventos
    @Operation(summary = "Método de consulta de lista de eventos", description = "Método responsável pela consulta de todos os eventos sem filtros")
    public ResponseEntity<List<EventoResponse>> listarTodos() {

        return ResponseEntity.ok(eventoService.listarTodosOsEventos()); // 200 + lista em JSON.
    }

    @GetMapping("/{eventoId}") // GET /eventos/5 -> {eventoId} vira o parâmetro abaixo.
    @Operation(summary = "Método de consulta de evento por id", description = "Método responsável pela consulta de um evento por id")
    public ResponseEntity<EventoResponse> buscarPorId(@PathVariable Long eventoId) {

        EventoResponse eventoBanco = eventoService.buscarEventoPorId(eventoId);

        return ResponseEntity.ok(eventoBanco);
    }

    @PostMapping // POST /eventos
    @Operation(summary = "Método de criação de evento", description = "Método responsável pela criação de um evento. O organizador logado se torna o dono do evento")
    public ResponseEntity<EventoResponse> criar(@RequestBody CriarEventoRequest eventoRequest) { // @RequestBody: JSON do corpo -> record.

        EventoResponse eventoCriadoBanco = eventoService.criarEvento(eventoRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(eventoCriadoBanco); // 201 Created.
    }

    @PatchMapping("/{eventoId}/status") // PATCH = alteração parcial (só o status).
    @Operation(summary = "Método de alterar Status", description = "Método responsável pela alteração dos status dos eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long eventoId, @RequestBody AtualizarStatusEventoRequest statusRequest) {

        eventoService.atualizarStatusEvento(eventoId, statusRequest);

        return ResponseEntity.ok().build(); // 200 sem corpo.
    }

    @PutMapping("/{eventoId}") // PUT = alteração completa do recurso.
    @Operation(summary = "Método de alterar informações do evento", description = "Método responsável pela alteração de eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<EventoResponse> atualizarEvento(@PathVariable Long eventoId, @RequestBody AtualizarEventoRequestDTO eventoRequest) {

        EventoResponse eventoAlteradoBanco = eventoService.atualizarEvento(eventoId, eventoRequest);

        return ResponseEntity.ok(eventoAlteradoBanco);
    }

    @DeleteMapping("/{eventoId}/excluir") // Mesmo padrão de rota da referência (/{id}/excluir).
    @Operation(summary = "Método de cancelamento de evento", description = "Método responsável pelo cancelamento do evento. Somente o organizador dono do evento pode excluir")
    public ResponseEntity<Void> cancelar(@PathVariable Long eventoId) {

        eventoService.cancelarEventoPorId(eventoId);

        return ResponseEntity.ok().build();
    }
}
