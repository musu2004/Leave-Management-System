package com.nexturn.lms.service;

import com.nexturn.lms.entity.Notification;
import com.nexturn.lms.enums.NotificationType;
import com.nexturn.lms.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public Notification create(
            Integer empId,
            NotificationType type,
            String message) {

        Notification n = new Notification();
        n.setEmpId(empId);
        n.setType(type);
        n.setMessage(message);

        return repository.save(n);
    }

    public List<Notification> getByEmployee(Integer empId) {
        return repository.findByEmpIdOrderByCreatedAtDesc(empId);
    }
}