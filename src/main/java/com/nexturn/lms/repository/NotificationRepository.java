package com.nexturn.lms.repository;

import com.nexturn.lms.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByEmpIdOrderByCreatedAtDesc(Integer empId);

}


