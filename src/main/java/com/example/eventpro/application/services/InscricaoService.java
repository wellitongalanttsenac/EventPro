// Camada APPLICATION: casos de uso da Inscrição.
package com.example.eventpro.application.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.dto.inscricao.AtualizarStatusInscricaoRequest;
import com.example.eventpro.application.dto.inscricao.CriarInscricaoRequest;
import com.example.eventpro.application.dto.inscricao.InscricaoResponse;
import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Inscricao;
import com.example.eventpro.domain.repository.InscricaoRepository;

import lombok.RequiredArgsConstructor;

/*
 * SERVICE de Inscrição (o equivalente à "matrícula" da referência: um participante entra em um evento).
 *
 * Regra de negócio central: o Organizador só gerencia as Inscrições dos Eventos que ele mesmo criou.
 * A criação da inscrição não exige ser o dono do evento,
 * mas a gestão (listar/confirmar/cancelar) exige que o organizador logado seja o dono.
 *
 * Com quem conversa:
 *  - InscricaoController chama os métodos públicos.
 *  - EventoService para buscar o evento e validar o dono.
 *  - CredencialService gera o código único quando a inscrição é confirmada.
 *  - InscricaoRepository para o banco.
 */
@Service
@RequiredArgsConstructor
public class InscricaoService {

    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerenciar as inscricoes!";

    private final InscricaoRepository inscricaoRepository;

    private final EventoService eventoService;

    private final CredencialService credencialService;

    // GET /eventos/{eventoId}/inscricoes
    public List<InscricaoResponse> listarInscricoesDoEvento(Long eventoId) {

        Evento eventoBanco = eventoService.buscarEventoEntidadePorId(eventoId);
        eventoService.validarOrganizadorEhDonoDoEvento(eventoBanco, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return inscricaoRepository.findByEventoId(eventoId)
                .stream()
                .map(InscricaoResponse::new)
                .toList();
    }

    // GET /eventos/{eventoId}/inscricoes/{inscricaoId}
    public InscricaoResponse buscarInscricaoPorId(Long eventoId, Long inscricaoId) {

        return new InscricaoResponse(buscarInscricaoDoEvento(eventoId, inscricaoId));
    }

    // POST /eventos/{eventoId}/inscricoes
    public InscricaoResponse criarInscricao(Long eventoId, CriarInscricaoRequest inscricaoRequest) {

        Evento eventoBanco = eventoService.buscarEventoEntidadePorId(eventoId);

        // Toda inscricao nasce PENDENTE, a credencial so e gerada quando for confirmada
        Inscricao inscricao = new Inscricao();
        inscricao.setNomeParticipante(inscricaoRequest.nomeParticipante());
        inscricao.setEmailParticipante(inscricaoRequest.emailParticipante());
        inscricao.setStatus(EnumStatusInscricao.PENDENTE);
        inscricao.setEvento(eventoBanco);

        var inscricaoBanco = inscricaoRepository.save(inscricao);
        return new InscricaoResponse(inscricaoBanco);
    }

    // PATCH /eventos/{eventoId}/inscricoes/{inscricaoId}/status
    public InscricaoResponse atualizarStatusInscricao(Long eventoId, Long inscricaoId, AtualizarStatusInscricaoRequest statusRequest) {

        Inscricao inscricaoBanco = buscarInscricaoGerenciavelPeloOrganizador(eventoId, inscricaoId);

        inscricaoBanco.setStatus(statusRequest.status());

        // A credencial unica so e gerada na primeira confirmacao
        boolean deveGerarCredencial = statusRequest.status() == EnumStatusInscricao.CONFIRMADA
                && inscricaoBanco.getCredencial() == null;

        if (deveGerarCredencial) {
            inscricaoBanco.setCredencial(credencialService.gerarCredencial());
        }

        inscricaoRepository.save(inscricaoBanco);

        return new InscricaoResponse(inscricaoBanco);
    }

    // DELETE /eventos/{eventoId}/inscricoes/{inscricaoId}/excluir -> exclusão lógica (status CANCELADA).
    public void cancelarInscricaoPorId(Long eventoId, Long inscricaoId) {

        Inscricao inscricaoBanco = buscarInscricaoGerenciavelPeloOrganizador(eventoId, inscricaoId);

        inscricaoBanco.setStatus(EnumStatusInscricao.CANCELADA);
        inscricaoRepository.save(inscricaoBanco);
    }

    private Inscricao buscarInscricaoEntidadePorId(Long inscricaoId) {

        return inscricaoRepository
                .findById(inscricaoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscricao nao encontrada na base"));
    }

    // A rota e /eventos/{eventoId}/inscricoes/{inscricaoId}, entao a inscricao precisa ser daquele evento
    private Inscricao buscarInscricaoDoEvento(Long eventoId, Long inscricaoId) {

        Inscricao inscricaoBanco = buscarInscricaoEntidadePorId(inscricaoId);

        boolean pertenceAoEvento = inscricaoBanco.getEvento() != null
                && inscricaoBanco.getEvento().getId().equals(eventoId);

        if (!pertenceAoEvento) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscricao nao encontrada neste evento");
        }

        return inscricaoBanco;
    }

    // Junta as duas regras: a inscrição é do evento da rota E o logado é o dono do evento.
    private Inscricao buscarInscricaoGerenciavelPeloOrganizador(Long eventoId, Long inscricaoId) {

        Inscricao inscricaoBanco = buscarInscricaoDoEvento(eventoId, inscricaoId);

        eventoService.validarOrganizadorEhDonoDoEvento(inscricaoBanco.getEvento(), MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return inscricaoBanco;
    }
}
