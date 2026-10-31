package com.example.eventpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Ponto de entrada da API.
// @SpringBootApplication liga a auto configuração do Spring Boot e faz o "component scan":
// procura todas as classes com @Service, @Component, @RestController, @Configuration, @Repository
// dentro de com.example.eventpro e cria os beans (é isso que permite a injeção de dependência).
@SpringBootApplication
public class EventProApplication {

	public static void main(String[] args) {
		// Sobe o servidor web embutido (Tomcat) na porta 8080.
		SpringApplication.run(EventProApplication.class, args);
	}

}
