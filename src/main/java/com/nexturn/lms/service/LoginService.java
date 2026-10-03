package com.nexturn.lms.service;

import com.nexturn.lms.dto.*;
import com.nexturn.lms.entity.Login;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LoginRepository;
import com.nexturn.lms.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public LoginService(LoginRepository repository, PasswordEncoder encoder, JwtService jwtService) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Login user = repository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new LoginResponse(user.getUsername(), user.getRole().name(), token);
    }

    public Login addUser(Login login) {
        login.setPassword(encoder.encode(login.getPassword()));
        return repository.save(login);
    }
}
