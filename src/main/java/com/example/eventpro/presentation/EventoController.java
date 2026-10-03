package com.example.eventpro.controller;

import com.example.eventpro.DTOs.AtualizarStatusEventoRequest;
import com.example.eventpro.DTOs.CriarEventoRequest;
import com.example.eventpro.entities.EnumStatusEvento;
import com.example.eventpro.entities.Evento;
import com.example.eventpro.entities.Usuario;
import com.example.eventpro.repository.EventoRepository;
import com.example.eventpro.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "Grupo de API responsável pela criação e consulta dos Eventos do sistema")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    @Operation(summary = "Método de consulta de lista de eventos", description = "Método responsável pela consulta de todos os eventos sem filtros")
    public ResponseEntity<List<Evento>> listarTodos() {
        return ResponseEntity.ok(eventoRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de consulta de evento por id", description = "Método responsável pela consulta de um evento por id")
    public ResponseEntity<Evento> buscarPorId(@PathVariable Long id) {

        Evento eventoBanco = eventoRepository.findById(id).orElse(null);
        if (eventoBanco != null) {
            return ResponseEntity.ok(eventoBanco);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Método de criação de evento", description = "Método responsável pela criação de um evento. O organizadorId informado se torna o dono do evento")
    public ResponseEntity<?> criar(@RequestBody CriarEventoRequest request) {

        Usuario organizador = usuarioRepository.findById(request.organizadorId()).orElse(null);
        if (organizador == null) {
            return ResponseEntity.badRequest().body("Organizador informado não existe!");
        }

        Evento evento = new Evento();
        evento.setNome(request.nome());
        evento.setDescricao(request.descricao());
        evento.setDataEvento(request.dataEvento());
        evento.setLocal(request.local());
        evento.setStatus(EnumStatusEvento.ABERTO);
        evento.setOrganizador(organizador);

        var eventoBanco = eventoRepository.save(evento);
        return ResponseEntity.ok(eventoBanco);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Método de alterar Status", description = "Método responsável pela alteração dos status dos eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestParam Long organizadorId, @RequestBody AtualizarStatusEventoRequest statusRequest) {

        Evento eventoBanco = eventoRepository.findById(id).orElse(null);
        if (eventoBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(eventoBanco, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciá-lo!");
        }

        eventoBanco.setStatus(statusRequest.status());
        eventoRepository.save(eventoBanco);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Método de alterar informações do evento", description = "Método responsável pela alteração de eventos. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<?> atualizarEvento(@PathVariable Long id, @RequestParam Long organizadorId, @RequestBody Evento evento) {

        try {
            Evento eventoBanco = eventoRepository.findById(id).orElse(null);

            if (eventoBanco == null) {
                return ResponseEntity.notFound().build();
            }

            if (!organizadorEhDono(eventoBanco, organizadorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciá-lo!");
            }

            eventoBanco.setNome(evento.getNome());
            eventoBanco.setDescricao(evento.getDescricao());
            eventoBanco.setDataEvento(evento.getDataEvento());
            eventoBanco.setLocal(evento.getLocal());
            eventoBanco.setStatus(evento.getStatus());
            eventoRepository.save(eventoBanco);

            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/{id}/excluir")
    @Operation(summary = "Método de cancelamento de evento", description = "Método responsável pelo cancelamento do evento. Somente o organizador dono do evento pode excluir")
    public ResponseEntity<?> excluir(@PathVariable Long id, @RequestParam Long organizadorId) {

        Evento eventoBanco = eventoRepository.findById(id).orElse(null);
        if (eventoBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(eventoBanco, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciá-lo!");
        }

        eventoBanco.setStatus(EnumStatusEvento.CANCELADO);
        eventoRepository.save(eventoBanco);
        return ResponseEntity.ok().build();
    }

    // Regra de negócio central: só o organizador que criou o evento pode gerenciá-lo.
    private boolean organizadorEhDono(Evento evento, Long organizadorId) {
        return evento.getOrganizador() != null && evento.getOrganizador().getId().equals(organizadorId);
    }
}
