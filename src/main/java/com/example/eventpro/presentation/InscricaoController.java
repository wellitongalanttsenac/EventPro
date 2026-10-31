// Camada PRESENTATION: entrada HTTP das inscrições.
package com.example.eventpro.presentation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventpro.application.dto.inscricao.AtualizarStatusInscricaoRequest;
import com.example.eventpro.application.dto.inscricao.CriarInscricaoRequest;
import com.example.eventpro.application.dto.inscricao.InscricaoResponse;
import com.example.eventpro.application.services.InscricaoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

// Regra de negócio central: o Organizador só gerencia as Inscrições dos Eventos que ele mesmo criou.
// A inscrição é um sub recurso do evento, por isso todas as rotas ficam em /eventos/{eventoId}/inscricoes (mesmo contrato usado pelo front).
// O service confere se a inscrição realmente pertence ao evento informado na rota e se o organizador logado é o dono.
@RestController
@RequestMapping
@Tag(name = "Inscrições", description = "Grupo de API responsável pela inscrição de participantes em Eventos e geração da credencial de confirmação")
public class InscricaoController {

    @Autowired
    private InscricaoService inscricaoService;

    @GetMapping("/eventos/{eventoId}/inscricoes")
    @Operation(summary = "Método de consulta das inscrições de um evento", description = "Método responsável por listar as inscrições de um evento. Somente o organizador dono do evento pode consultar")
    public ResponseEntity<List<InscricaoResponse>> listarTodas(@PathVariable Long eventoId) {

        return ResponseEntity.ok(inscricaoService.listarInscricoesDoEvento(eventoId));
    }

    @GetMapping("/eventos/{eventoId}/inscricoes/{inscricaoId}")
    @Operation(summary = "Método de consulta de inscrição por id", description = "Método responsável pela consulta de uma inscrição, incluindo a credencial gerada quando confirmada")
    public ResponseEntity<InscricaoResponse> buscarPorId(@PathVariable Long eventoId, @PathVariable Long inscricaoId) {

        InscricaoResponse inscricaoBanco = inscricaoService.buscarInscricaoPorId(eventoId, inscricaoId);

        return ResponseEntity.ok(inscricaoBanco);
    }

    @PostMapping("/eventos/{eventoId}/inscricoes")
    @Operation(summary = "Método de inscrição em um evento", description = "Método responsável por registrar a inscrição de um participante em um evento. A inscrição nasce com status PENDENTE")
    public ResponseEntity<InscricaoResponse> criar(@PathVariable Long eventoId, @RequestBody CriarInscricaoRequest inscricaoRequest) {

        InscricaoResponse inscricaoCriadaBanco = inscricaoService.criarInscricao(eventoId, inscricaoRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(inscricaoCriadaBanco); // 201
    }

    @PatchMapping("/eventos/{eventoId}/inscricoes/{inscricaoId}/status")
    @Operation(summary = "Método de alterar status da inscrição", description = "Método responsável por confirmar ou cancelar uma inscrição. Somente o organizador dono do evento pode alterar. Ao confirmar, uma credencial única é gerada")
    public ResponseEntity<InscricaoResponse> atualizarStatus(@PathVariable Long eventoId, @PathVariable Long inscricaoId, @RequestBody AtualizarStatusInscricaoRequest statusRequest) {

        InscricaoResponse inscricaoAlteradaBanco = inscricaoService.atualizarStatusInscricao(eventoId, inscricaoId, statusRequest);

        return ResponseEntity.ok(inscricaoAlteradaBanco);
    }

    @DeleteMapping("/eventos/{eventoId}/inscricoes/{inscricaoId}/excluir")
    @Operation(summary = "Método de cancelamento de inscrição", description = "Método responsável pelo cancelamento de uma inscrição. Somente o organizador dono do evento pode cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long eventoId, @PathVariable Long inscricaoId) {

        inscricaoService.cancelarInscricaoPorId(eventoId, inscricaoId);

        return ResponseEntity.ok().build();
    }
}
