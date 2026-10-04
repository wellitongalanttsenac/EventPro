package com.example.eventpro.application.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.DTOs.evento.AtualizarEventoRequestDTO;
import com.example.eventpro.application.DTOs.evento.AtualizarStatusEventoRequest;
import com.example.eventpro.application.DTOs.evento.CriarEventoRequest;
import com.example.eventpro.application.DTOs.evento.EventoResponse;
import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.EventoRepository;
import com.example.eventpro.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventoService {

    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerencia-lo!";

    private final EventoRepository eventoRepository;

    private final UsuarioRepository usuarioRepository;

    public List<EventoResponse> listarTodosOsEventos() {

        return eventoRepository.findAll()
        .stream()
        .map(EventoResponse::new)
        .toList();
    }

    public EventoResponse buscarEventoPorId(Long eventoId) {

        return new EventoResponse(buscarEventoEntidadePorId(eventoId));
    }

    public EventoResponse criarEvento(CriarEventoRequest eventoRequest) {

        // O organizador informado precisa existir, ele se torna o dono do evento
        Usuario organizadorBanco = usuarioRepository
        .findById(eventoRequest.organizadorId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organizador informado nao existe na base"));

        Evento evento = new Evento();
        evento.setNome(eventoRequest.nome());
        evento.setDescricao(eventoRequest.descricao());
        evento.setDataEvento(eventoRequest.dataEvento());
        evento.setLocal(eventoRequest.local());
        evento.setStatus(EnumStatusEvento.ABERTO);
        evento.setOrganizador(organizadorBanco);

        var eventoBanco = eventoRepository.save(evento);
        return new EventoResponse(eventoBanco);
    }

    public void atualizarStatusEvento(Long eventoId, Long organizadorId, AtualizarStatusEventoRequest statusRequest) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setStatus(statusRequest.status());
        eventoRepository.save(eventoBanco);
    }

    public EventoResponse atualizarEvento(Long eventoId, Long organizadorId, AtualizarEventoRequestDTO eventoRequest) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setNome(eventoRequest.nome());
        eventoBanco.setDescricao(eventoRequest.descricao());
        eventoBanco.setDataEvento(eventoRequest.dataEvento());
        eventoBanco.setLocal(eventoRequest.local());
        eventoBanco.setStatus(eventoRequest.status());
        eventoRepository.save(eventoBanco);

        return new EventoResponse(eventoBanco);
    }

    public void cancelarEventoPorId(Long eventoId, Long organizadorId) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, organizadorId, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setStatus(EnumStatusEvento.CANCELADO);
        eventoRepository.save(eventoBanco);
    }

    // Usado tambem pelos services de Palestrante e Inscricao, assim a busca do evento fica em um unico lugar
    public Evento buscarEventoEntidadePorId(Long eventoId) {

        // Caso nao encontre retorna direto uma exception
        return eventoRepository
        .findById(eventoId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento nao encontrado na base"));
    }

    // Regra de negocio central: so o organizador que criou o evento pode gerencia-lo.
    // A mensagem e recebida por parametro porque cada funcionalidade (evento, palestrante, inscricao) explica o bloqueio de um jeito.
    public void validarOrganizadorEhDonoDoEvento(Evento evento, Long organizadorId, String mensagemAcessoNegado) {

        boolean organizadorEhDono = evento.getOrganizador() != null
        && evento.getOrganizador().getId().equals(organizadorId);

        if (!organizadorEhDono) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, mensagemAcessoNegado);
        }
    }
}
