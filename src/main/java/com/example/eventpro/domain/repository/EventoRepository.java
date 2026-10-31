// Camada DOMAIN: contrato de persistência do Evento.
package com.example.eventpro.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;

// REPOSITÓRIO do Evento. Quem usa: EventoService.
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    // select * from evento where status = ?
    Optional<List<Evento>> findByStatus(EnumStatusEvento status);

    // "Organizador_Id" navega pelo relacionamento: select * from evento where organizador_id = ?
    List<Evento> findByOrganizadorId(Long organizadorId);
}
