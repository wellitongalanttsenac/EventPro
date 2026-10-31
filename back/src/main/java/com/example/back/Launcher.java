package com.example.back;

import javafx.application.Application;

// Classe com o main() que inicia o JavaFX (igual à referência).
// Fica separada da AdminApplication porque rodar direto uma classe que herda de Application
// fora do module path dá erro de "JavaFX runtime components are missing".
public class Launcher {
    public static void main(String[] args) {
        Application.launch(AdminApplication.class, args);
    }
}

