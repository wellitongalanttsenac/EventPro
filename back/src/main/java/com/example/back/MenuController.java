package com.example.back;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

// Controller da tela de MENU (menu-view.fxml), igual à referência.
public class MenuController {

    // Botão "Cadastro Admin": troca para a tela de cadastro.
    @FXML
    public void abrirCadastro(ActionEvent event) throws IOException {
        FXMLLoader loader =
                new FXMLLoader(getClass().getResource("/com/example/back/cadastro-usuario-view.fxml"));

        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    // Botão "Sair": encerra o programa.
    @FXML
    public void sair() {
        System.exit(0);
    }

}
