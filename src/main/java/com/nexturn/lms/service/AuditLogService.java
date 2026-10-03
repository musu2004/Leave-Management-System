package com.nexturn.lms.service;

import com.nexturn.lms.entity.AuditLog;
import com.nexturn.lms.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {
    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) { this.repository = repository; }

    public AuditLog log(Integer empId, Integer leaveId, String action, String details) {
        return repository.save(new AuditLog(empId, leaveId, action, details));
    }

    public List<AuditLog> getByEmployee(Integer empId) {
        return repository.findByEmpIdOrderByActionDateDesc(empId);
    }
}