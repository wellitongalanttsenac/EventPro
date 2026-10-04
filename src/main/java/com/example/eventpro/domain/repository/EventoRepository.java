package com.example.eventpro.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    Optional<List<Evento>> findByStatus(EnumStatusEvento status);

    List<Evento> findByOrganizadorId(Long organizadorId);
}
