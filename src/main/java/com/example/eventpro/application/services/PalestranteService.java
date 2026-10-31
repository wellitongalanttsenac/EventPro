// Camada APPLICATION: casos de uso do Palestrante.
package com.example.eventpro.application.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.dto.palestrante.AtualizarPalestranteRequest;
import com.example.eventpro.application.dto.palestrante.CriarPalestranteRequest;
import com.example.eventpro.application.dto.palestrante.PalestranteResponse;
import com.example.eventpro.domain.entities.Evento;
import com.example.eventpro.domain.entities.Palestrante;
import com.example.eventpro.domain.repository.PalestranteRepository;

import lombok.RequiredArgsConstructor;

/*
 * SERVICE de Palestrante.
 *
 * Palestrante é um sub recurso do Evento (rotas /eventos/{eventoId}/palestrantes).
 * Ler é livre para quem está logado; criar/alterar/excluir só o dono do evento.
 *
 * Com quem conversa:
 *  - PalestranteController chama os métodos públicos.
 *  - EventoService para buscar o evento e validar o dono (reuso da regra, DRY).
 *  - PalestranteRepository para o banco.
 */
@Service
@RequiredArgsConstructor
public class PalestranteService {

    private static final String MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO = "Apenas o organizador que criou o evento pode gerenciar os palestrantes!";

    private final PalestranteRepository palestranteRepository;

    private final EventoService eventoService;

    // GET /eventos/{eventoId}/palestrantes
    public List<PalestranteResponse> listarPalestrantesDoEvento(Long eventoId) {

        // Garante que o evento existe antes de listar, caso contrario retorna exception
        eventoService.buscarEventoEntidadePorId(eventoId);

        return palestranteRepository.findByEventoId(eventoId)
                .stream()
                .map(PalestranteResponse::new)
                .toList();
    }

    // GET /eventos/{eventoId}/palestrantes/{palestranteId}
    public PalestranteResponse buscarPalestrantePorId(Long eventoId, Long palestranteId) {

        return new PalestranteResponse(buscarPalestranteDoEvento(eventoId, palestranteId));
    }

    // POST /eventos/{eventoId}/palestrantes
    public PalestranteResponse criarPalestrante(Long eventoId, CriarPalestranteRequest palestranteRequest) {

        Evento eventoBanco = eventoService.buscarEventoEntidadePorId(eventoId);
        eventoService.validarOrganizadorEhDonoDoEvento(eventoBanco, MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        Palestrante palestrante = new Palestrante();
        palestrante.setNome(palestranteRequest.nome());
        palestrante.setCpf(palestranteRequest.cpf());
        palestrante.setEmail(palestranteRequest.email());
        palestrante.setEvento(eventoBanco); // Liga o palestrante ao evento (chave estrangeira evento_id).

        var palestranteBanco = palestranteRepository.save(palestrante);
        return new PalestranteResponse(palestranteBanco);
    }

    // PUT /eventos/{eventoId}/palestrantes/{palestranteId}
    public PalestranteResponse atualizarPalestrante(Long eventoId, Long palestranteId, AtualizarPalestranteRequest palestranteRequest) {

        Palestrante palestranteBanco = buscarPalestranteGerenciavelPeloOrganizador(eventoId, palestranteId);

        palestranteBanco.setNome(palestranteRequest.nome());
        palestranteBanco.setCpf(palestranteRequest.cpf());
        palestranteBanco.setEmail(palestranteRequest.email());
        palestranteRepository.save(palestranteBanco);

        return new PalestranteResponse(palestranteBanco);
    }

    // DELETE /eventos/{eventoId}/palestrantes/{palestranteId}/excluir -> aqui a exclusão é física (apaga do banco).
    public void excluirPalestrantePorId(Long eventoId, Long palestranteId) {

        Palestrante palestranteBanco = buscarPalestranteGerenciavelPeloOrganizador(eventoId, palestranteId);

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

    // Junta as duas regras: o palestrante é do evento da rota E o logado é o dono do evento.
    private Palestrante buscarPalestranteGerenciavelPeloOrganizador(Long eventoId, Long palestranteId) {

        Palestrante palestranteBanco = buscarPalestranteDoEvento(eventoId, palestranteId);

        eventoService.validarOrganizadorEhDonoDoEvento(palestranteBanco.getEvento(), MENSAGEM_ORGANIZADOR_NAO_E_DONO_DO_EVENTO);

        return palestranteBanco;
    }
}
