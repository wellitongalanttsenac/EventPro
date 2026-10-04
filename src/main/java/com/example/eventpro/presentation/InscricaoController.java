package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.DTOs.inscricao.AtualizarStatusInscricaoRequest;
import com.example.eventpro.application.DTOs.inscricao.CriarInscricaoRequest;
import com.example.eventpro.application.DTOs.inscricao.InscricaoResponse;
import com.example.eventpro.application.service.InscricaoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

// Regra de negócio central: o Organizador só gerencia as Inscrições dos Eventos que ele mesmo criou.
// O eventoId só aparece na rota quando é necessário (listar e criar), nas demais a inscrição já identifica o evento.
// Existem duas formas de nomear es estruturar a rota, por subrecursos/hieranquia da api, a inscrição é um sub recurso do evento, logo (evento/incrição...)
// Ou o raso, onde so sera utilizado o pai quando necessario.
@RestController
@RequestMapping
@Tag(name = "Inscrições", description = "Grupo de API responsável pela inscrição de participantes em Eventos e geração da credencial de confirmação")
public class InscricaoController {

    @Autowired
    private InscricaoService inscricaoService;

    @GetMapping("/eventos/{eventoId}/inscricoes")
    @Operation(summary = "Método de consulta das inscrições de um evento", description = "Método responsável por listar as inscrições de um evento. Somente o organizador dono do evento pode consultar")
    public ResponseEntity<List<InscricaoResponse>> listarTodas(@PathVariable Long eventoId, @RequestParam Long organizadorId) {

        return ResponseEntity.ok(inscricaoService.listarInscricoesDoEvento(eventoId, organizadorId));

    }

    @GetMapping("inscricoes/{inscricaoId}")
    @Operation(summary = "Método de consulta de inscrição por id", description = "Método responsável pela consulta de uma inscrição, incluindo a credencial gerada quando confirmada")
    public ResponseEntity<InscricaoResponse> buscarPorId(@PathVariable Long inscricaoId) {

        InscricaoResponse inscricaoBanco = inscricaoService.buscarInscricaoPorId(inscricaoId);

        return ResponseEntity.ok(inscricaoBanco);
    }

    @PostMapping("/evento/{eventoId}/inscricoes")
    @Operation(summary = "Método de inscrição em um evento", description = "Método responsável por registrar a inscrição de um participante em um evento. A inscrição nasce com status PENDENTE")
    public ResponseEntity<InscricaoResponse> criar(@PathVariable Long eventoId, @RequestBody CriarInscricaoRequest inscricaoRequest) {

        InscricaoResponse inscricaoCriadaBanco = inscricaoService.criarInscricao(eventoId, inscricaoRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(inscricaoCriadaBanco);
    }

    @PatchMapping("inscricoes/{inscricaoId}/status")
    @Operation(summary = "Método de alterar status da inscrição", description = "Método responsável por confirmar ou cancelar uma inscrição. Somente o organizador dono do evento pode alterar. Ao confirmar, uma credencial única é gerada")
    public ResponseEntity<InscricaoResponse> atualizarStatus(@PathVariable Long inscricaoId, @RequestParam Long organizadorId, @RequestBody AtualizarStatusInscricaoRequest statusRequest) {

        InscricaoResponse inscricaoAlteradaBanco = inscricaoService.atualizarStatusInscricao(inscricaoId, organizadorId, statusRequest);

        return ResponseEntity.ok(inscricaoAlteradaBanco);
    }

    @DeleteMapping("inscricoes/{inscricaoId}/excluir")
    @Operation(summary = "Método de cancelamento de inscrição", description = "Método responsável pelo cancelamento de uma inscrição. Somente o organizador dono do evento pode cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long inscricaoId, @RequestParam Long organizadorId) {

        inscricaoService.cancelarInscricaoPorId(inscricaoId, organizadorId);

        return ResponseEntity.ok().build();
    }
}
