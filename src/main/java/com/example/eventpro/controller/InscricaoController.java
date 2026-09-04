package com.example.eventpro.controller;

import com.example.eventpro.DTOs.AtualizarStatusInscricaoRequest;
import com.example.eventpro.DTOs.CriarInscricaoRequest;
import com.example.eventpro.entities.EnumStatusInscricao;
import com.example.eventpro.entities.Evento;
import com.example.eventpro.entities.Inscricao;
import com.example.eventpro.repository.EventoRepository;
import com.example.eventpro.repository.InscricaoRepository;
import com.example.eventpro.service.CredencialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Regra de negócio central: o Organizador só gerencia as Inscrições dos Eventos que ele mesmo criou.
// A criação da inscrição é feita pelo participante (não exige ser o dono do evento),
// mas a gestão (confirmar/cancelar) exige que o organizadorId seja o dono do evento.
@RestController
@RequestMapping("/eventos/{eventoId}/inscricoes")
@Tag(name = "Inscrições", description = "Grupo de API responsável pela inscrição de participantes em Eventos e geração da credencial de confirmação")
public class InscricaoController {

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private CredencialService credencialService;

    @GetMapping
    @Operation(summary = "Método de consulta das inscrições de um evento", description = "Método responsável por listar as inscrições de um evento. Somente o organizador dono do evento pode consultar")
    public ResponseEntity<?> listarTodas(@PathVariable Long eventoId, @RequestParam Long organizadorId) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar as inscrições!");
        }

        return ResponseEntity.ok(inscricaoRepository.findByEventoId(eventoId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de consulta de inscrição por id", description = "Método responsável pela consulta de uma inscrição, incluindo a credencial gerada quando confirmada")
    public ResponseEntity<Inscricao> buscarPorId(@PathVariable Long eventoId, @PathVariable Long id) {

        Inscricao inscricaoBanco = inscricaoRepository.findById(id).orElse(null);
        if (inscricaoBanco == null || !inscricaoBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inscricaoBanco);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Método de inscrição em um evento", description = "Método responsável por registrar a inscrição de um participante em um evento. A inscrição nasce com status PENDENTE")
    public ResponseEntity<?> criar(@PathVariable Long eventoId, @RequestBody CriarInscricaoRequest request) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        Inscricao inscricao = new Inscricao();
        inscricao.setNomeParticipante(request.nomeParticipante());
        inscricao.setEmailParticipante(request.emailParticipante());
        inscricao.setStatus(EnumStatusInscricao.PENDENTE);
        inscricao.setEvento(evento);

        var inscricaoBd = inscricaoRepository.save(inscricao);
        return ResponseEntity.ok(inscricaoBd);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Método de alterar status da inscrição", description = "Método responsável por confirmar ou cancelar uma inscrição. Somente o organizador dono do evento pode alterar. Ao confirmar, uma credencial única é gerada")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long eventoId, @PathVariable Long id, @RequestParam Long organizadorId, @RequestBody AtualizarStatusInscricaoRequest statusRequest) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar as inscrições!");
        }

        Inscricao inscricaoBanco = inscricaoRepository.findById(id).orElse(null);
        if (inscricaoBanco == null || !inscricaoBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }

        inscricaoBanco.setStatus(statusRequest.status());

        if (statusRequest.status() == EnumStatusInscricao.CONFIRMADA && inscricaoBanco.getCredencial() == null) {
            inscricaoBanco.setCredencial(credencialService.gerarCredencial());
        }

        inscricaoRepository.save(inscricaoBanco);
        return ResponseEntity.ok(inscricaoBanco);
    }

    @DeleteMapping("/{id}/excluir")
    @Operation(summary = "Método de cancelamento de inscrição", description = "Método responsável pelo cancelamento de uma inscrição. Somente o organizador dono do evento pode cancelar")
    public ResponseEntity<?> excluir(@PathVariable Long eventoId, @PathVariable Long id, @RequestParam Long organizadorId) {

        Evento evento = eventoRepository.findById(eventoId).orElse(null);
        if (evento == null) {
            return ResponseEntity.notFound().build();
        }

        if (!organizadorEhDono(evento, organizadorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o organizador que criou o evento pode gerenciar as inscrições!");
        }

        Inscricao inscricaoBanco = inscricaoRepository.findById(id).orElse(null);
        if (inscricaoBanco == null || !inscricaoBanco.getEvento().getId().equals(eventoId)) {
            return ResponseEntity.notFound().build();
        }

        inscricaoBanco.setStatus(EnumStatusInscricao.CANCELADA);
        inscricaoRepository.save(inscricaoBanco);
        return ResponseEntity.ok().build();
    }

    private boolean organizadorEhDono(Evento evento, Long organizadorId) {
        return evento.getOrganizador() != null && evento.getOrganizador().getId().equals(organizadorId);
    }
}
