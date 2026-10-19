package com.example.eventpro.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Inscricao;
import com.example.eventpro.domain.entities.Palestrante;
import com.example.eventpro.domain.repository.InscricaoRepository;
import com.example.eventpro.domain.repository.PalestranteRepository;

// Palestrante e inscricao sao acessados por /eventos/{eventoId}/..., entao precisam pertencer ao evento da URL
class SubRecursoDoEventoTest {

    private PalestranteRepository palestranteRepository;
    private InscricaoRepository inscricaoRepository;
    private PalestranteService palestranteService;
    private InscricaoService inscricaoService;

    @BeforeEach
    void configurar() {
        palestranteRepository = mock(PalestranteRepository.class);
        inscricaoRepository = mock(InscricaoRepository.class);
        EventoService eventoService = mock(EventoService.class);

        palestranteService = new PalestranteService(palestranteRepository, eventoService);
        inscricaoService = new InscricaoService(inscricaoRepository, eventoService, new CredencialService());
    }

    private Evento eventoComId(Long id) {
        Evento evento = new Evento();
        evento.setId(id);
        return evento;
    }

    @Test
    void deveRetornar404QuandoPalestranteNaoPertenceAoEventoDaRota() {
        Palestrante palestrante = new Palestrante();
        palestrante.setId(7L);
        palestrante.setEvento(eventoComId(1L));
        when(palestranteRepository.findById(7L)).thenReturn(Optional.of(palestrante));

        var erro = assertThrows(ResponseStatusException.class, () -> palestranteService.buscarPalestrantePorId(2L, 7L));

        assertEquals(HttpStatus.NOT_FOUND, erro.getStatusCode());
    }

    @Test
    void deveBuscarPalestranteQuandoPertenceAoEventoDaRota() {
        Palestrante palestrante = new Palestrante();
        palestrante.setId(7L);
        palestrante.setEvento(eventoComId(2L));
        when(palestranteRepository.findById(7L)).thenReturn(Optional.of(palestrante));

        assertEquals(7L, palestranteService.buscarPalestrantePorId(2L, 7L).id());
    }

    @Test
    void deveRetornar404QuandoInscricaoNaoPertenceAoEventoDaRota() {
        Inscricao inscricao = new Inscricao();
        inscricao.setId(5L);
        inscricao.setEvento(eventoComId(1L));
        when(inscricaoRepository.findById(5L)).thenReturn(Optional.of(inscricao));

        var erro = assertThrows(ResponseStatusException.class, () -> inscricaoService.buscarInscricaoPorId(2L, 5L));

        assertEquals(HttpStatus.NOT_FOUND, erro.getStatusCode());
    }

    @Test
    void deveBuscarInscricaoQuandoPertenceAoEventoDaRota() {
        Inscricao inscricao = new Inscricao();
        inscricao.setId(5L);
        inscricao.setEvento(eventoComId(2L));
        when(inscricaoRepository.findById(5L)).thenReturn(Optional.of(inscricao));

        assertEquals(5L, inscricaoService.buscarInscricaoPorId(2L, 5L).id());
    }
}
