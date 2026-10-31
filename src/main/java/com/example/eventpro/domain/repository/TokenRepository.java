// Camada DOMAIN: os repositórios ficam junto do domínio porque são o "contrato" de persistência das entidades.
package com.example.eventpro.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.Token;

/*
 * REPOSITÓRIO do Token (igual à referência do professor)
 *
 * O que é: uma INTERFACE. Não escrevemos a implementação: o Spring Data JPA cria
 * uma classe por baixo dos panos em tempo de execução.
 *
 * Herdando JpaRepository<Token, Long> já ganhamos save, findById, findAll, delete...
 * (Token = entidade, Long = tipo do id).
 *
 * Conceito SOLID (DIP - Inversão de Dependência): o TokenService depende desta
 * interface (abstração), não de uma classe concreta de banco.
 */
@Repository // Marca como componente de acesso a dados (o Spring cria o bean e traduz erros de banco).
public interface TokenRepository extends JpaRepository<Token, Long> {

    // "Query method": o Spring lê o NOME do método e monta o SQL sozinho:
    // select * from token where token = ?
    // Optional = pode vir vazio (token não existe no banco), obrigando quem chama a tratar esse caso.
    Optional<Token> findTokenByToken(String token);
}
