package com.example.eventpro.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenApi(){

        return new OpenAPI()
                .info(new Info().title("EventPro")
                        .version("1.0.0")
                        .description("Api para aulo fullstack")
                );
    }
}
