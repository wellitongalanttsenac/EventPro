package com.example.eventpro.application.DTOs.palestrante;

// Dto para request de Atualizar os dados do palestrante com todas as informacoes
public record AtualizarPalestranteRequest(String nome, String cpf, String email) {
}
