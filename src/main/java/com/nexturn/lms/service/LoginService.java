package com.nexturn.lms.service;

import com.nexturn.lms.dto.LoginRequest;
import com.nexturn.lms.dto.LoginResponse;
import com.nexturn.lms.entity.Login;

public interface LoginService {
    LoginResponse login(LoginRequest request);
    Login addUser(Login login);
}