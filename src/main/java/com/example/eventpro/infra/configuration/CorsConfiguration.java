// Camada INFRA: configuração web.
package com.example.eventpro.infra.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * CORS (Cross-Origin Resource Sharing) - igual à referência.
 *
 * O navegador bloqueia por padrão chamadas de um site (front em localhost:3000) para outro
 * endereço (API em localhost:8080). Aqui liberamos explicitamente o front.
 *
 * Quem usa: a SecurityConfiguration, com .cors(Customizer.withDefaults()), aplica estas regras
 * também nas requisições que passam pelo Spring Security (inclusive o "preflight" OPTIONS que o
 * navegador manda antes de requisições com o header Authorization).
 */
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                                  // Vale para todas as rotas.
                .allowedOrigins("http://localhost:3000")            // Só o front Next.js.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders("*")                                // Inclui o "Authorization" do JWT.
                .allowCredentials(true);
    }
}
