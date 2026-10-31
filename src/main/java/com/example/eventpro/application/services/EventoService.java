// Camada APPLICATION: casos de uso do Evento.
package com.example.eventpro.application.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.dto.evento.AtualizarEventoRequestDTO;
import com.example.eventpro.application.dto.evento.AtualizarStatusEventoRequest;
import com.example.eventpro.application.dto.evento.CriarEventoRequest;
import com.example.eventpro.application.dto.evento.EventoResponse;
import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.EventoRepository;
import com.example.eventpro.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/*
 * SERVICE de Evento.
 *
 * Regra de negócio central do EventPro: todo evento tem um DONO (o organizador que criou),
 * e só ele pode alterar, cancelar e gerenciar palestrantes/inscrições do evento.
 *
 * Quem é o organizador vem do token (AuthService.getUsuarioLogado()), igual à referência
 * usa o getUsuarioLogado() no UsuarioService. Nada de confiar em um id mandado pela URL.
 *
 * Com quem conversa:
 *  - EventoController (presentation) chama os métodos públicos.
 *  - PalestranteService e InscricaoService reaproveitam buscarEventoEntidadePorId e
 *    validarOrganizadorEhDonoDoEvento (DRY: a regra do dono fica em um lugar só).
 *  - EventoRepository / UsuarioRepository para o banco.
 *  - AuthService para saber quem está logado.
 */
@Service
@RequiredArgsConstructor
public class EventoService {

    // "static final" = constante da classe (mesma mensagem reaproveitada nos métodos).
    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerencia-lo!";

    private final EventoRepository eventoRepository;

    private final UsuarioRepository usuarioRepository;

    private final AuthService authService;

    // GET /eventos -> todos os eventos (qualquer organizador logado pode ver).
    public List<EventoResponse> listarTodosOsEventos() {

        return eventoRepository.findAll()
                .stream()                 // Transforma a lista em um fluxo para processar item a item.
                .map(EventoResponse::new) // Converte cada entidade Evento em DTO (method reference para o construtor).
                .toList();                // Volta para lista.
    }

    // GET /eventos/{id}
    public EventoResponse buscarEventoPorId(Long eventoId) {

        return new EventoResponse(buscarEventoEntidadePorId(eventoId));
    }

    // POST /eventos
    public EventoResponse criarEvento(CriarEventoRequest eventoRequest) {

        // O dono do evento é quem está logado. Buscamos a entidade para fazer o relacionamento no JPA.
        Usuario organizadorBanco = usuarioRepository
                .findById(authService.getUsuarioLogado().id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organizador informado nao existe na base"));

        Evento evento = new Evento();
        evento.setNome(eventoRequest.nome());
        evento.setDescricao(eventoRequest.descricao());
        evento.setDataEvento(eventoRequest.dataEvento());
        evento.setLocal(eventoRequest.local());
        evento.setStatus(EnumStatusEvento.ABERTO); // Todo evento nasce ABERTO.
        evento.setOrganizador(organizadorBanco);

        // save devolve a entidade já com o id gerado pelo banco.
        var eventoBanco = eventoRepository.save(evento);
        return new EventoResponse(eventoBanco);
    }

    // PATCH /eventos/{id}/status
    public void atualizarStatusEvento(Long eventoId, AtualizarStatusEventoRequest statusRequest) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setStatus(statusRequest.status());
        eventoRepository.save(eventoBanco);
    }

    // PUT /eventos/{id}
    public EventoResponse atualizarEvento(Long eventoId, AtualizarEventoRequestDTO eventoRequest) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setNome(eventoRequest.nome());
        eventoBanco.setDescricao(eventoRequest.descricao());
        eventoBanco.setDataEvento(eventoRequest.dataEvento());
        eventoBanco.setLocal(eventoRequest.local());
        eventoBanco.setStatus(eventoRequest.status());
        eventoRepository.save(eventoBanco);

        return new EventoResponse(eventoBanco);
    }

    // DELETE /eventos/{id}/excluir -> exclusão lógica: o evento não some, vira CANCELADO.
    public void cancelarEventoPorId(Long eventoId) {

        Evento eventoBanco = buscarEventoEntidadePorId(eventoId);
        validarOrganizadorEhDonoDoEvento(eventoBanco, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        eventoBanco.setStatus(EnumStatusEvento.CANCELADO);
        eventoRepository.save(eventoBanco);
    }

    // Usado tambem pelos services de Palestrante e Inscricao, assim a busca do evento fica em um unico lugar
    public Evento buscarEventoEntidadePorId(Long eventoId) {

        // Caso nao encontre retorna direto uma exception (404 no GlobalExceptionHandler)
        return eventoRepository
                .findById(eventoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento nao encontrado na base"));
    }

    // Regra de negocio central: so o organizador que criou o evento pode gerencia-lo.
    // A mensagem e recebida por parametro porque cada funcionalidade (evento, palestrante, inscricao) explica o bloqueio de um jeito.
    public void validarOrganizadorEhDonoDoEvento(Evento evento, String mensagemAcessoNegado) {

        Long organizadorLogadoId = authService.getUsuarioLogado().id();

        boolean organizadorEhDono = evento.getOrganizador() != null
                && evento.getOrganizador().getId().equals(organizadorLogadoId);

        if (!organizadorEhDono) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, mensagemAcessoNegado); // 403
        }
    }
}
