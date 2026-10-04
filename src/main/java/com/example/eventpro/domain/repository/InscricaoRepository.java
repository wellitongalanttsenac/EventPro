package com.example.eventpro.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Inscricao;

@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    List<Inscricao> findByEventoId(Long eventoId);

    List<Inscricao> findByEventoIdAndStatus(Long eventoId, EnumStatusInscricao status);
}
