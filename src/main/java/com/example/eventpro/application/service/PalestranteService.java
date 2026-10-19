package com.example.eventpro.application.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.DTOs.palestrante.AtualizarPalestranteRequest;
import com.example.eventpro.application.DTOs.palestrante.CriarPalestranteRequest;
import com.example.eventpro.application.DTOs.palestrante.PalestranteResponse;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Palestrante;
import com.example.eventpro.domain.repository.PalestranteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PalestranteService {

    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerenciar os palestrantes!";

    private final PalestranteRepository palestranteRepository;

    private final EventoService eventoService;

    public List<PalestranteResponse> listarPalestrantesDoEvento(Long eventoId) {

        // Garante que o evento existe antes de listar, caso contrario retorna exception
        eventoService.buscarEventoEntidadePorId(eventoId);

        return palestranteRepository.findByEventoId(eventoId)
        .stream()
        .map(PalestranteResponse::new)
        .toList();
    }

    public PalestranteResponse buscarPalestrantePorId(Long eventoId, Long palestranteId) {

        return new PalestranteResponse(buscarPalestranteDoEvento(eventoId, palestranteId));
    }

    public PalestranteResponse criarPalestrante(Long eventoId, Long organizadorId, CriarPalestranteRequest palestranteRequest) {

        Evento eventoBanco = eventoService.buscarEventoEntidadePorId(eventoId);
        eventoService.validarOrganizadorEhDonoDoEvento(eventoBanco, organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        Palestrante palestrante = new Palestrante();
        palestrante.setNome(palestranteRequest.nome());
        palestrante.setCpf(palestranteRequest.cpf());
        palestrante.setEmail(palestranteRequest.email());
        palestrante.setEvento(eventoBanco);

        var palestranteBanco = palestranteRepository.save(palestrante);
        return new PalestranteResponse(palestranteBanco);
    }

    public PalestranteResponse atualizarPalestrante(Long eventoId, Long palestranteId, Long organizadorId, AtualizarPalestranteRequest palestranteRequest) {

        Palestrante palestranteBanco = buscarPalestranteGerenciavelPeloOrganizador(eventoId, palestranteId, organizadorId);

        palestranteBanco.setNome(palestranteRequest.nome());
        palestranteBanco.setCpf(palestranteRequest.cpf());
        palestranteBanco.setEmail(palestranteRequest.email());
        palestranteRepository.save(palestranteBanco);

        return new PalestranteResponse(palestranteBanco);
    }

    public void excluirPalestrantePorId(Long eventoId, Long palestranteId, Long organizadorId) {

        Palestrante palestranteBanco = buscarPalestranteGerenciavelPeloOrganizador(eventoId, palestranteId, organizadorId);

        palestranteRepository.delete(palestranteBanco);
    }

    private Palestrante buscarPalestranteEntidadePorId(Long palestranteId) {

        // Caso nao encontre retorna direto uma exception
        return palestranteRepository
        .findById(palestranteId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Palestrante nao encontrado na base"));
    }

    // A rota e /eventos/{eventoId}/palestrantes/{palestranteId}, entao o palestrante precisa ser daquele evento
    private Palestrante buscarPalestranteDoEvento(Long eventoId, Long palestranteId) {

        Palestrante palestranteBanco = buscarPalestranteEntidadePorId(palestranteId);

        boolean pertenceAoEvento = palestranteBanco.getEvento() != null
        && palestranteBanco.getEvento().getId().equals(eventoId);

        if (!pertenceAoEvento) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Palestrante nao encontrado neste evento");
        }

        return palestranteBanco;
    }

    private Palestrante buscarPalestranteGerenciavelPeloOrganizador(Long eventoId, Long palestranteId, Long organizadorId) {

        Palestrante palestranteBanco = buscarPalestranteDoEvento(eventoId, palestranteId);

        eventoService.validarOrganizadorEhDonoDoEvento(palestranteBanco.getEvento(), organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return palestranteBanco;
    }
}
