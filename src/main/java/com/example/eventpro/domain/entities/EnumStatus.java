package com.example.eventpro.domain.entities;

// ENUM = lista fechada de valores possíveis. O compilador impede qualquer valor fora dela.
// Status do cadastro do organizador (Usuario). Igual ao EnumStatusUsuario da referência.
public enum EnumStatus {
    ATIVO,      // Pode usar o sistema normalmente.
    BLOQUEADO,  // Suspenso temporariamente (o front não deixa entrar).
    EXCLUIDO,   // Exclusão lógica: o registro continua no banco, só muda o status.
}
