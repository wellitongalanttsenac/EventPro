package com.example.eventpro.controller;

import com.example.eventpro.entities.Evento;
import com.example.eventpro.entities.Palestrante;
import com.example.eventpro.repository.EventoRepository;
import com.example.eventpro.repository.PalestranteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Regra de negócio central: o Organizador só gerencia Palestrantes dos Eventos que ele mesmo criou.
// Por isso o Palestrante é sempre tratado a partir do Evento ao qual pertence.
@RestController
@RequestMapping("/eventos/{eventoId}/palestrantes")
@Tag(name = "Palestrantes", description = "Grupo de API responsável pela criação e consulta dos Palestrantes de um Evento")
public class PalestranteController {

    @Autowired
    private PalestranteRepository palestranteRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @GetMapping
    @Operation(summary = "Método de consulta de lista de palestrantes de um evento", description = "Método responsável pela consulta de todos os palestrantes de um evento")
    public ResponseEntity<?> listarTodos(@PathVariable Long eventoId) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(palestranteRepository.findByEventoId(eventoId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de consulta de palestrante por id", description = "Método responsável pela consulta de um palestrante de um evento por id")
    public ResponseEntity<Palestrante> buscarPorId(@PathVariable Long eventoId, @PathVariable Long id) {

        Palestrante palestranteBanco = palestranteRepository.findById(id).orElse(null);
        if (palestranteBanco == null || !palestranteBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(palestranteBanco);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Método de criação de palestrante", description = "Método responsável pela criação de um palestrante vinculado a um evento. Somente o organizador dono do evento pode cadastrar")
    public ResponseEntity<?> criar(@PathVariable Long eventoId, @RequestParam Long organizadorId, @RequestBody Palestrante palestrante) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar os palestrantes!");
        }

        palestrante.setEvento(evento);
        var palestranteBd = palestranteRepository.save(palestrante);
        return ResponseEntity.ok(palestranteBd);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Método de alterar informações do palestrante", description = "Método responsável pela alteração de palestrantes. Somente o organizador dono do evento pode alterar")
    public ResponseEntity<?> atualizar(@PathVariable Long eventoId, @PathVariable Long id, @RequestParam Long organizadorId, @RequestBody Palestrante palestrante) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar os palestrantes!");
        }

        Palestrante palestranteBanco = palestranteRepository.findById(id).orElse(null);
        if (palestranteBanco == null || !palestranteBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }

        palestranteBanco.setNome(palestrante.getNome());
        palestranteBanco.setCpf(palestrante.getCpf());
        palestranteBanco.setEmail(palestrante.getEmail());
        palestranteRepository.save(palestranteBanco);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/excluir")
    @Operation(summary = "Método de exclusão de palestrante", description = "Método responsável pela exclusão de um palestrante do evento. Somente o organizador dono do evento pode excluir")
    public ResponseEntity<?> excluir(@PathVariable Long eventoId, @PathVariable Long id, @RequestParam Long organizadorId) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar os palestrantes!");
        }

        Palestrante palestranteBanco = palestranteRepository.findById(id).orElse(null);
        if (palestranteBanco == null || !palestranteBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }

        palestranteRepository.delete(palestranteBanco);
        return ResponseEntity.ok().build();
    }

    private boolean organizadorEhDono(Evento evento, Long organizadorId) {
        return evento.getOrganizador() != null && evento.getOrganizador().getId().equals(organizadorId);
    }
}
