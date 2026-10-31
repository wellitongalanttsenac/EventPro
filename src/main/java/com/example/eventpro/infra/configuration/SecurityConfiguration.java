// Camada INFRA: configuração do framework de segurança.
package com.example.eventpro.infra.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
 * CONFIGURAÇÃO DO SPRING SECURITY (igual à referência do professor)
 *
 * Aqui definimos as regras de acesso da API:
 *  - quais rotas são públicas (permitAll);
 *  - que todas as outras exigem estar autenticado (anyRequest().authenticated());
 *  - que o nosso JwtFilter roda ANTES do filtro padrão de login do Spring.
 */
@Configuration      // Classe de configuração: os métodos @Bean viram objetos gerenciados pelo Spring.
@EnableWebSecurity  // Liga a segurança web do Spring Security.
public class SecurityConfiguration {

    @Autowired
    private JwtFilter jwtFilter;

    // SecurityFilterChain = a "cadeia de filtros" por onde toda requisição passa.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                // Usa as regras de CORS da CorsConfiguration (libera o front em localhost:3000).
                .cors(Customizer.withDefaults())
                // CSRF protege sites com sessão/cookie. Nossa API é stateless (JWT no header), então desligamos.
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Mesmas rotas públicas do JwtFilter.
                        .requestMatchers("/auth/login",
                                "/auth/esqueci-senha",
                                "/auth/redefinir-senha",
                                "/usuarios/admin",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                // Rota interna do Spring Boot que monta o corpo de erros não tratados;
                                // sem liberar, um erro 500 viraria um 403 vazio.
                                "/error"
                        ).permitAll()
                        // Todo o resto (eventos, palestrantes, inscrições, usuários) exige token.
                        .anyRequest().authenticated()
                )
                // Coloca o JwtFilter antes do filtro de login padrão do Spring,
                // assim quando o Spring for checar "está autenticado?", o JwtFilter já preencheu o SecurityContextHolder.
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
