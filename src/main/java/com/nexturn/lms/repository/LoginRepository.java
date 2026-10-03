package com.nexturn.lms.repository;

import com.nexturn.lms.entity.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface LoginRepository extends JpaRepository<Login, String> {

    Optional<Login> findByUsername(String username);

}
