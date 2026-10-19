package com.example.eventpro.presentation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.eventpro.application.service.InscricaoService;
import com.example.eventpro.application.service.PalestranteService;

// As rotas seguem exatamente o contrato que o front (Next.js) consome: palestrantes e inscricoes
// sao sub-recursos de /eventos/{eventoId}
class RotasEventoTest {

    private PalestranteService palestranteService;
    private InscricaoService inscricaoService;
    private MockMvc mockMvc;

    @BeforeEach
    void configurar() {
        palestranteService = mock(PalestranteService.class);
        inscricaoService = mock(InscricaoService.class);

        var palestranteController = new PalestranteController();
        ReflectionTestUtils.setField(palestranteController, "palestranteService", palestranteService);

        var inscricaoController = new InscricaoController();
        ReflectionTestUtils.setField(inscricaoController, "inscricaoService", inscricaoService);

        mockMvc = MockMvcBuilders.standaloneSetup(palestranteController, inscricaoController).build();
    }

    @Test
    void deveBuscarPalestranteDentroDoEvento() throws Exception {
        mockMvc.perform(get("/eventos/3/palestrantes/7"))
                .andExpect(status().isOk());

        verify(palestranteService).buscarPalestrantePorId(3L, 7L);
    }

    @Test
    void deveAtualizarPalestranteDentroDoEvento() throws Exception {
        mockMvc.perform(put("/eventos/3/palestrantes/7").param("organizadorId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Pal\",\"cpf\":\"12345678909\",\"email\":\"pal@eventpro.com\"}"))
                .andExpect(status().isOk());

        verify(palestranteService).atualizarPalestrante(eq(3L), eq(7L), eq(1L), any());
    }

    @Test
    void deveExcluirPalestranteDentroDoEvento() throws Exception {
        mockMvc.perform(delete("/eventos/3/palestrantes/7/excluir").param("organizadorId", "1"))
                .andExpect(status().isOk());

        verify(palestranteService).excluirPalestrantePorId(3L, 7L, 1L);
    }

    @Test
    void deveCriarInscricaoPelaRotaDeEventosNoPlural() throws Exception {
        mockMvc.perform(post("/eventos/3/inscricoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeParticipante\":\"Ana\",\"emailParticipante\":\"ana@eventpro.com\"}"))
                .andExpect(status().isCreated());

        verify(inscricaoService).criarInscricao(eq(3L), any());
    }

    @Test
    void deveBuscarInscricaoDentroDoEvento() throws Exception {
        mockMvc.perform(get("/eventos/3/inscricoes/5"))
                .andExpect(status().isOk());

        verify(inscricaoService).buscarInscricaoPorId(3L, 5L);
    }

    @Test
    void deveAtualizarStatusDaInscricaoDentroDoEvento() throws Exception {
        mockMvc.perform(patch("/eventos/3/inscricoes/5/status").param("organizadorId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONFIRMADA\"}"))
                .andExpect(status().isOk());

        verify(inscricaoService).atualizarStatusInscricao(eq(3L), eq(5L), eq(1L), any());
    }

    @Test
    void deveCancelarInscricaoDentroDoEvento() throws Exception {
        mockMvc.perform(delete("/eventos/3/inscricoes/5/excluir").param("organizadorId", "1"))
                .andExpect(status().isOk());

        verify(inscricaoService).cancelarInscricaoPorId(3L, 5L, 1L);
    }
}
