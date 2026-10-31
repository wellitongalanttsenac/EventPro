// Camada APPLICATION: services.
package com.example.eventpro.application.services;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

// Diferencial do EventPro: simula a geração de um número de credencial único
// (hash) para cada Inscrição confirmada em um Evento.
// Quem usa: InscricaoService, quando o status muda para CONFIRMADA pela primeira vez.
// SRP: a forma de gerar a credencial fica isolada aqui; o InscricaoService só pede "me dá uma credencial".
@Service
public class CredencialService {

    public String gerarCredencial() {
        try {
            // Base aleatória: UUID (identificador único) + o relógio em nanossegundos.
            String base = UUID.randomUUID().toString() + System.nanoTime();

            // SHA-256 transforma a base em um hash de 32 bytes.
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(base.getBytes());

            // Converte os bytes para texto hexadecimal (cada byte vira 2 caracteres, ex: "0f").
            StringBuilder hexHash = new StringBuilder();
            for (byte b : hashBytes) {
                hexHash.append(String.format("%02x", b));
            }

            // Reduz o hash para um código de credencial mais curto e legivel
            return hexHash.substring(0, 12).toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            // Só aconteceria se a JVM não tivesse SHA-256 (todas têm).
            throw new RuntimeException("Erro ao gerar credencial da inscrição", e);
        }
    }
}
