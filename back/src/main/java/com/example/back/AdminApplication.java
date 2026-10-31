package com.example.back;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

/*
 * Aplicação DESKTOP de administração (JavaFX), igual à referência do professor.
 * Ela é um CLIENTE da API: não acessa o banco, só chama POST /usuarios/admin por HTTP.
 *
 * Conceitos do JavaFX:
 *  - Stage  = a janela.
 *  - Scene  = o conteúdo que está dentro da janela.
 *  - FXML   = arquivo XML que descreve a tela (botões, campos). Cada FXML aponta para um Controller.
 */
public class AdminApplication extends Application {

    // O JavaFX chama start() quando a aplicação sobe, entregando a janela principal.
    @Override
    public void start(Stage stage) throws IOException {
        // Carrega a tela de login (src/main/resources/com/example/back/login-view.fxml).
        FXMLLoader fxmlLoader = new FXMLLoader(AdminApplication.class.getResource("login-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 320, 240); // Largura x altura iniciais.
        stage.setTitle("EventPro Admin");
        stage.setScene(scene);
        stage.show(); // Mostra a janela.
    }
}
