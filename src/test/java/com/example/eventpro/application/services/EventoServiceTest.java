package com.example.eventpro.application.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.application.dto.evento.AtualizarStatusEventoRequest;
import com.example.eventpro.application.dto.evento.CriarEventoRequest;
import com.example.eventpro.application.dto.evento.EventoResponse;
import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.EventoRepository;
import com.example.eventpro.domain.repository.UsuarioRepository;

// Regra de negocio central: o dono do evento e o organizador logado (vem do token, nao da URL)
class EventoServiceTest {

    private EventoRepository eventoRepository;
    private UsuarioRepository usuarioRepository;
    private EventoService eventoService;

    @BeforeEach
    void configurar() {
        eventoRepository = mock(EventoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        AuthService authService = mock(AuthService.class);

        eventoService = new EventoService(eventoRepository, usuarioRepository, authService);
        when(authService.getUsuarioLogado()).thenReturn(new UsuarioLogado(1L, "organizador@eventpro.com", List.of()));
    }

    private Usuario organizadorComId(Long id) {
        Usuario organizador = new Usuario();
        organizador.setId(id);
        return organizador;
    }

    private Evento eventoDoOrganizador(Long organizadorId) {
        Evento evento = new Evento();
        evento.setId(10L);
        evento.setStatus(EnumStatusEvento.ABERTO);
        evento.setOrganizador(organizadorComId(organizadorId));
        return evento;
    }

    @Test
    void deveCriarEventoComOUsuarioLogadoComoOrganizador() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(organizadorComId(1L)));
        when(eventoRepository.save(any(Evento.class))).thenAnswer(chamada -> chamada.getArgument(0));

        EventoResponse eventoCriado = eventoService.criarEvento(new CriarEventoRequest("Festa de fim de ano", "Confraternizacao", new Date(), "Salao de festas"));

        assertEquals(1L, eventoCriado.organizador().id());
        assertEquals(EnumStatusEvento.ABERTO, eventoCriado.status());
    }

    @Test
    void deveRecusarAlteracaoDeEventoDeOutroOrganizador() {
        when(eventoRepository.findById(10L)).thenReturn(Optional.of(eventoDoOrganizador(2L)));

        var erro = assertThrows(ResponseStatusException.class,
                () -> eventoService.atualizarStatusEvento(10L, new AtualizarStatusEventoRequest(EnumStatusEvento.CANCELADO)));

        assertEquals(HttpStatus.FORBIDDEN, erro.getStatusCode());
        verify(eventoRepository, never()).save(any());
    }

    @Test
    void devePermitirQueODonoCanceleOEvento() {
        Evento evento = eventoDoOrganizador(1L);
        when(eventoRepository.findById(10L)).thenReturn(Optional.of(evento));

        eventoService.cancelarEventoPorId(10L);

        assertEquals(EnumStatusEvento.CANCELADO, evento.getStatus());
        verify(eventoRepository).save(evento);
    }
}
