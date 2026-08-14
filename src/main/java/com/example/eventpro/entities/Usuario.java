package com.example.eventpro.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    public long id;
    public String nome;
    public String cpf;
    public String senha;
    public String email;
}
