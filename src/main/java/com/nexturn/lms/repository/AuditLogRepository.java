package com.nexturn.lms.repository;

import com.nexturn.lms.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEmpIdOrderByActionDateDesc(Integer empId);
}
