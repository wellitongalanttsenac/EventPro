// Camada DOMAIN: contrato de persistência da Inscricao.
package com.example.eventpro.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Inscricao;

// REPOSITÓRIO da Inscricao. Quem usa: InscricaoService.
@Repository
public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    // Todas as inscrições de um evento: select * from inscricao where evento_id = ?
    List<Inscricao> findByEventoId(Long eventoId);

    // Inscrições de um evento filtradas por status (ex: só as CONFIRMADAS).
    List<Inscricao> findByEventoIdAndStatus(Long eventoId, EnumStatusInscricao status);
}
