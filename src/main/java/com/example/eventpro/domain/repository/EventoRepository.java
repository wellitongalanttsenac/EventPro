package com.example.eventpro.repository;

import com.example.eventpro.entities.EnumStatusEvento;
import com.example.eventpro.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    Optional<List<Evento>> findByStatus(EnumStatusEvento status);

    List<Evento> findByOrganizadorId(Long organizadorId);
}
