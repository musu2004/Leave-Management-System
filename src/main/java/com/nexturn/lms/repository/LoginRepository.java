package com.nexturn.lms.repository;

import com.nexturn.lms.entity.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import com.nexturn.lms.enums.Role;


public interface LoginRepository extends JpaRepository<Login, String> {

    Optional<Login> findByUsername(String username);
    List<Login> findByRole(Role role);
}
