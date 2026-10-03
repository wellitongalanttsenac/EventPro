package com.example.eventpro.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

// Diferencial do EventPro: simula a geração de um número de credencial único
// (hash) para cada Inscrição confirmada em um Evento.
@Service
public class CredencialService {

    public String gerarCredencial() {
        try {
            String base = UUID.randomUUID().toString() + System.nanoTime();

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(base.getBytes());

            StringBuilder hexHash = new StringBuilder();
            for (byte b : hashBytes) {
                hexHash.append(String.format("%02x", b));
            }

            // Reduz o hash para um código de credencial mais curto e legivel
            return hexHash.substring(0, 12).toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar credencial da inscrição", e);
        }
    }
}
