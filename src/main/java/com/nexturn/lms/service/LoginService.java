package com.nexturn.lms.service;

import com.nexturn.lms.dto.LoginRequest;
import com.nexturn.lms.dto.LoginResponse;
import com.nexturn.lms.entity.Login;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LoginRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final LoginRepository repository;

    public LoginService(LoginRepository repository) {
        this.repository = repository;
    }

    public LoginResponse login(LoginRequest request) {
        Login user = repository.findByUsername(request.username())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invalid username or password"));

        boolean passwordMatches;

        try {
            passwordMatches = BCrypt.checkpw(
                    request.password(),
                    user.getPassword());
        } catch (IllegalArgumentException ex) {
            passwordMatches = false;
        }

        if (!passwordMatches) {
            throw new ResourceNotFoundException(
                    "Invalid username or password");
        }

        return new LoginResponse(
                user.getUsername(),
                user.getRole().name());
    }

    public Login addUser(Login login) {
        login.setPassword(
                BCrypt.hashpw(login.getPassword(), BCrypt.gensalt(10)));

        return repository.save(login);
    }
}