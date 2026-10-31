// Camada APPLICATION: DTOs (Data Transfer Objects) são os objetos que circulam entre as camadas.
package com.example.eventpro.application.dto.auth;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

import com.example.eventpro.domain.entities.Usuario;

/*
 * DTO UsuarioLogado (igual à referência do professor, sem o empresa_id que não existe no EventPro)
 *
 * O que é: a "identidade" de quem está fazendo a requisição.
 *
 * Fluxo de quem cria e quem usa:
 *  1. JwtFilter recebe o header "Authorization: Bearer <token>".
 *  2. TokenService.verificarToken valida o token e devolve um UsuarioLogado.
 *  3. JwtFilter guarda esse UsuarioLogado no SecurityContextHolder (a "sessão" da requisição).
 *  4. AuthService.getUsuarioLogado() lê de lá, e os services (ex: EventoService)
 *     usam o id para aplicar a regra "só o dono do evento pode gerenciar".
 *
 * Por que um DTO e não a entidade Usuario: só carregamos o necessário (id, e-mail, permissões),
 * sem senha e sem nada que o Hibernate precise gerenciar.
 *
 * "record" (Java 16+): classe imutável; o Java gera construtor, getters (id(), email()...),
 * equals, hashCode e toString automaticamente.
 */
public record UsuarioLogado(Long id,
                            String email,
                            // Permissões do usuário (ex: ROLE_USER, ROLE_ADMIN) no formato que o Spring Security entende.
                            Collection<? extends GrantedAuthority> authorities) {

    // Construtor auxiliar: monta o UsuarioLogado direto a partir da entidade.
    // "this(...)" chama o construtor principal do record.
    public UsuarioLogado(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getAuthorities()
        );
    }
}
