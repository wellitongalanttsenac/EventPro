module com.example.back {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.back to javafx.fxml;
    exports com.example.back;
}