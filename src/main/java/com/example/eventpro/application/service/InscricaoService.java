package com.example.eventpro.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.DTOs.inscricao.AtualizarStatusInscricaoRequest;
import com.example.eventpro.application.DTOs.inscricao.CriarInscricaoRequest;
import com.example.eventpro.application.DTOs.inscricao.InscricaoResponse;
import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Inscricao;
import com.example.eventpro.domain.repository.InscricaoRepository;

// Regra de negócio central: o Organizador só gerencia as Inscrições dos Eventos que ele mesmo criou.
// A criação da inscrição é feita pelo participante (não exige ser o dono do evento),
// mas a gestão (confirmar/cancelar) exige que o organizadorId seja o dono do evento.
@Service
public class InscricaoService {

    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerenciar as inscricoes!";

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private CredencialService credencialService;

    public List<InscricaoResponse> listarInscricoesDoEvento(Long eventoId, Long organizadorId) {

        Evento eventoBanco = eventoService.buscarEventoEntidadePorId(eventoId);
        eventoService.validarOrganizadorEhDonoDoEvento(eventoBanco, organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return inscricaoRepository.findByEventoId(eventoId)
        .stream()
        .map(InscricaoResponse::new)
        .toList();
    }

    public InscricaoResponse buscarInscricaoPorId(Long inscricaoId) {

        return new InscricaoResponse(buscarInscricaoEntidadePorId(inscricaoId));
    }

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

    public InscricaoResponse atualizarStatusInscricao(Long inscricaoId, Long organizadorId, AtualizarStatusInscricaoRequest statusRequest) {

        Inscricao inscricaoBanco = buscarInscricaoGerenciavelPeloOrganizador(inscricaoId, organizadorId);

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

    public void cancelarInscricaoPorId(Long inscricaoId, Long organizadorId) {

        Inscricao inscricaoBanco = buscarInscricaoGerenciavelPeloOrganizador(inscricaoId, organizadorId);

        inscricaoBanco.setStatus(EnumStatusInscricao.CANCELADA);
        inscricaoRepository.save(inscricaoBanco);
    }

    private Inscricao buscarInscricaoEntidadePorId(Long inscricaoId) {

        return inscricaoRepository
        .findById(inscricaoId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscricao nao encontrada na base"));
    }

    // O evento e descoberto pela propria inscricao, por isso a rota nao precisa do eventoId
    private Inscricao buscarInscricaoGerenciavelPeloOrganizador(Long inscricaoId, Long organizadorId) {

        Inscricao inscricaoBanco = buscarInscricaoEntidadePorId(inscricaoId);

        if (inscricaoBanco.getEvento() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscricao nao esta vinculada a nenhum evento");
        }

        eventoService.validarOrganizadorEhDonoDoEvento(inscricaoBanco.getEvento(), organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return inscricaoBanco;
    }
}
