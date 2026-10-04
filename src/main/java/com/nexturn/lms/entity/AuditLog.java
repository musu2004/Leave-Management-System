package com.nexturn.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    private Integer empId;

    private Integer leaveId;

    @Column(nullable = false, length = 50)
    private String actionStatus;

    @Column(nullable = false, length = 200)
    private String details;

    @Column(nullable = false)
    private LocalDateTime actionDate = LocalDateTime.now();

    public AuditLog() {
    }

    public AuditLog(
            Integer empId,
            Integer leaveId,
            String actionStatus,
            String details) {

        this.empId = empId;
        this.leaveId = leaveId;
        this.actionStatus = actionStatus;
        this.details = details;
    }

    public Long getAuditId() {
        return auditId;
    }

    public Integer getEmpId() {
        return empId;
    }

    public Integer getLeaveId() {
        return leaveId;
    }

    public String getActionStatus() {
        return actionStatus;
    }

    public String getDetails() {
        return details;
    }

    public LocalDateTime getActionDate() {
        return actionDate;
    }
}