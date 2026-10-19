package com.example.eventpro.presentation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.eventpro.application.service.InscricaoService;
import com.example.eventpro.application.service.PalestranteService;

// Garante que as rotas de palestrante e inscricao seguem o mesmo padrao de /eventos
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
    void deveExcluirPalestrantePelaRotaDePalestrantes() throws Exception {
        mockMvc.perform(delete("/palestrantes/7/excluir").param("organizadorId", "1"))
                .andExpect(status().isOk());

        verify(palestranteService).excluirPalestrantePorId(7L, 1L);
    }

    @Test
    void deveCriarInscricaoPelaRotaDeEventosNoPlural() throws Exception {
        mockMvc.perform(post("/eventos/3/inscricoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeParticipante\":\"Ana\",\"emailParticipante\":\"ana@eventpro.com\"}"))
                .andExpect(status().isCreated());

        verify(inscricaoService).criarInscricao(eq(3L), any());
    }
}
