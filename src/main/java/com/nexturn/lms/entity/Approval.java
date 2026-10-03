package com.nexturn.lms.entity;

import com.nexturn.lms.enums.LeaveStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval")
public class Approval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long approvalId;

    @Column(nullable = false)
    private Integer leaveId;

    @Column(nullable = false)
    private Integer managerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeaveStatus decision;

    @Column(length = 200)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime actionDate = LocalDateTime.now();

    public Approval() {}

    public Long getApprovalId() { return approvalId; }
    public Integer getLeaveId() { return leaveId; }
    public void setLeaveId(Integer leaveId) { this.leaveId = leaveId; }
    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }
    public LeaveStatus getDecision() { return decision; }
    public void setDecision(LeaveStatus decision) { this.decision = decision; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getActionDate() { return actionDate; }
}
