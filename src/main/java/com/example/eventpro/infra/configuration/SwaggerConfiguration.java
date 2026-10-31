// Camada INFRA: documentação da API.
package com.example.eventpro.infra.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * SWAGGER / OpenAPI (igual à referência): gera a página http://localhost:8080/swagger-ui/index.html
 * com todas as rotas documentadas (os @Tag e @Operation dos controllers).
 *
 * O "bearerAuth" cria o botão "Authorize" no Swagger: cola o token do /auth/login
 * e ele passa a mandar "Authorization: Bearer <token>" nas chamadas de teste.
 */
@Configuration
public class SwaggerConfiguration {

    @Bean // O objeto devolvido vira um bean que o springdoc usa para montar a documentação.
    public OpenAPI customOpenApi() {

        return new OpenAPI()
                // Todas as rotas exigem o esquema "bearerAuth" por padrão.
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                // Define o esquema: autenticação HTTP do tipo bearer com formato JWT.
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                ))
                // Dados que aparecem no topo da página do Swagger.
                .info(new Info().title("EventPro")
                        .version("1.0.0")
                        .description("API de organização de festas e eventos")
                );
    }
}
