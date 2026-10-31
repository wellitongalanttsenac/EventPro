// Camada INFRA: detalhes técnicos (HTTP, segurança, frameworks). Fica na borda da arquitetura.
package com.example.eventpro.infra.configuration;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.eventpro.application.services.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 * FILTRO JWT (igual à referência do professor)
 *
 * O que é um filtro: código que roda ANTES do controller, em toda requisição HTTP.
 * Pense numa portaria: confere o crachá (token) antes de deixar entrar.
 *
 * OncePerRequestFilter: garante que o filtro roda uma única vez por requisição.
 *
 * Fluxo:
 *  1. Rota pública? deixa passar sem token.
 *  2. Pega o header "Authorization: Bearer <token>".
 *  3. TokenService.verificarToken valida e devolve o UsuarioLogado.
 *  4. Coloca o UsuarioLogado no SecurityContextHolder -> para o Spring Security a requisição está autenticada,
 *     e os services conseguem saber quem é o organizador (AuthService.getUsuarioLogado()).
 *  5. Qualquer falha -> 401 "Token invalido" e a requisição NÃO chega no controller.
 *
 * Quem registra este filtro na cadeia do Spring Security: SecurityConfiguration (addFilterBefore).
 */
@Component // Vira um bean, para poder ser injetado na SecurityConfiguration.
public class JwtFilter extends OncePerRequestFilter {

    @Autowired // Injeção por campo, igual à referência.
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Caminho chamado, ex: "/eventos/3/palestrantes".
        String uri = request.getRequestURI();

        // Rotas públicas: precisam ser as MESMAS do permitAll da SecurityConfiguration.
        if (uri.startsWith("/swagger-ui")
                || uri.startsWith("/v2/api-docs")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-resources")
                || uri.startsWith("/webjars")
                // Login e recuperação de senha: quem chama ainda não tem token.
                || uri.startsWith("/auth/login")
                || uri.startsWith("/auth/esqueci-senha")
                || uri.startsWith("/auth/redefinir-senha")
                // Cadastro de admin pelo desktop JavaFX: não tem login, quem protege é a secretKey.
                || uri.startsWith("/usuarios/admin")
        ) {
            filterChain.doFilter(request, response); // Segue para o próximo filtro / controller.
            return;                                  // E encerra este filtro.
        }

        String authHeader = request.getHeader("Authorization");

        // O padrão do header é "Bearer " + token.
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", ""); // Sobra só o JWT.

            try {

                var usuarioLogado = tokenService.verificarToken(token);

                // Objeto de autenticação do Spring Security:
                // (principal = quem é, credentials = null porque já validamos, authorities = permissões).
                var user = new UsernamePasswordAuthenticationToken(
                        usuarioLogado,
                        null,
                        usuarioLogado.authorities()
                );

                // A partir daqui, a requisição está autenticada.
                SecurityContextHolder.getContext().setAuthentication(user);

            } catch (Exception e) {
                // Assinatura errada, expirado, ou token que não está no banco.
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.getWriter().println("Token invalido");
                return;
            }

        } else {
            // Rota protegida sem token.
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Token invalido");
            return;
        }

        // Token válido: segue o fluxo normal até o controller.
        filterChain.doFilter(request, response);
    }
}
