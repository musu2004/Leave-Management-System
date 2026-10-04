package com.nexturn.lms.controller;

import com.nexturn.lms.dto.LoginRequest;
import com.nexturn.lms.dto.LoginResponse;
import com.nexturn.lms.entity.Login;
import com.nexturn.lms.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin
public class LoginController {

    private final LoginService service;

    public LoginController(LoginService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/user")
    public ResponseEntity<Login> addUser(@RequestBody Login login) {
        return ResponseEntity.ok(service.addUser(login));
    }
}