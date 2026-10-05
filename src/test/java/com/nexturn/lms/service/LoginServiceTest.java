package com.nexturn.lms.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.dto.LoginRequest;
import com.nexturn.lms.dto.LoginResponse;
import com.nexturn.lms.entity.Login;
import com.nexturn.lms.enums.Role;
import com.nexturn.lms.exception.ResourceNotFoundException;

@SpringBootTest
@Transactional
class LoginServiceTest {

    @Autowired
    private LoginService loginService;

    @Test
    void testAddUserAndLogin() {
        Login user =new Login("alex","password123",Role.EMPLOYEE);
        Login saved = loginService.addUser(user);

        assertNotNull(saved);
        assertNotEquals("password123", saved.getPassword());
        
        LoginRequest request =
                new LoginRequest("alex","password123");
        LoginResponse response =
                loginService.login(request);

        assertNotNull(response);
        assertEquals("alex", response.username());
        assertEquals("EMPLOYEE", response.role());
    }

    @Test
    void testInvalidPassword() {
        Login user =
                new Login("rohit","password123",Role.EMPLOYEE);
        
        loginService.addUser(user);
        LoginRequest request =
                new LoginRequest("rohit","wrongpassword");

        assertThrows(ResourceNotFoundException.class,
                () -> loginService.login(request)
        );
    }

    @Test
    void testInvalidUsername() {

        LoginRequest request =
                new LoginRequest("doesnotexist","password123");
        
        assertThrows(ResourceNotFoundException.class,
                () -> loginService.login(request)
        );
    }
}