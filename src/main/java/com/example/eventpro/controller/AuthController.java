package com.example.eventpro.controller;

import com.example.eventpro.DTOs.LoginRequest;
import com.example.eventpro.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.HttpURLConnection;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        if(loginRequest.email().equals("string") && loginRequest.senha().equals("string")){
            var token = tokenService.geraToken(loginRequest.email());

            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpURLConnection.HTTP_UNAUTHORIZED).build();
    }
}
