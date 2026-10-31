package com.example.eventpro.application.dto.evento;

import java.util.Date;

import com.example.eventpro.application.dto.usuario.UsuarioResponse;
import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;

/*
 * DTO de SAÍDA do Evento (o JSON que a API devolve).
 *
 * Por que não devolver a entidade direto: a entidade é do domínio e tem relacionamentos JPA;
 * o DTO controla exatamente o que sai da API (Clean Architecture: o "lado de fora" não enxerga o domínio).
 * O organizador e devolvido como UsuarioResponse para nunca expor a senha.
 */
public record EventoResponse(Long id, String nome, String descricao, Date dataEvento, String local, EnumStatusEvento status, UsuarioResponse organizador) {

    // Construtor que converte a entidade em DTO (usado com .map(EventoResponse::new) nos services).
    public EventoResponse(Evento entidadeEvento) {
        this(
                entidadeEvento.getId(),
                entidadeEvento.getNome(),
                entidadeEvento.getDescricao(),
                entidadeEvento.getDataEvento(),
                entidadeEvento.getLocal(),
                entidadeEvento.getStatus(),
                // Operador ternário: se não tiver organizador devolve null, senão converte para DTO.
                entidadeEvento.getOrganizador() == null ? null : new UsuarioResponse(entidadeEvento.getOrganizador())
        );
    }
}
