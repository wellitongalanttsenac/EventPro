package com.example.eventpro.repository;

import com.example.eventpro.entities.EnumStatusInscricao;
import com.example.eventpro.entities.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    List<Inscricao> findByEventoId(Long eventoId);

    List<Inscricao> findByEventoIdAndStatus(Long eventoId, EnumStatusInscricao status);
}
