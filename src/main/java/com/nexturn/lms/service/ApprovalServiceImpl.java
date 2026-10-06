package com.nexturn.lms.service;

import com.nexturn.lms.dto.ApprovalRequest;
import com.nexturn.lms.entity.Approval;
import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.enums.LeaveStatus;
import com.nexturn.lms.enums.NotificationType;
import com.nexturn.lms.exception.BusinessException;
import com.nexturn.lms.repository.ApprovalRepository;
import com.nexturn.lms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovalServiceImpl implements ApprovalService {
    private final ApprovalRepository approvalRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveService leaveService;
    private final LeaveBalanceService balanceService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    public ApprovalServiceImpl(
            ApprovalRepository approvalRepository,
            EmployeeRepository employeeRepository,
            LeaveService leaveService,
            LeaveBalanceService balanceService,
            AuditLogService auditLogService,
            NotificationService notificationService) {
        this.approvalRepository = approvalRepository;
        this.employeeRepository = employeeRepository;
        this.leaveService = leaveService;
        this.balanceService = balanceService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }
    @Override
    @Transactional
    public LeaveApplication decide(
            Integer leaveId,
            ApprovalRequest request,
            boolean approve) {
        LeaveApplication leave = leaveService.getById(leaveId);
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException(
                    "Only pending requests can be approved or rejected");
        }
        Employee employee = employeeRepository
                .findById(leave.getEmpId())
                .orElseThrow(() -> new BusinessException(
                        "Employee not found"));
        if (employee.getManagerId() == null
                || !employee.getManagerId().equals(request.managerId())) {
            throw new BusinessException(
                    "Manager is not assigned to this employee");
        }
        LeaveStatus decision = approve
                ? LeaveStatus.APPROVED
                : LeaveStatus.REJECTED;
        leave.setStatus(decision);
        Approval approval = new Approval();
        approval.setLeaveId(leaveId);
        approval.setManagerId(request.managerId());
        approval.setDecision(decision);
        approval.setComment(request.comment());
        approvalRepository.save(approval);
        if (approve) {
            balanceService.addUsedDays(
                    leave.getEmpId(),
                    leave.getLeaveTypeId(),
                    leave.getStartDate().getYear(),
                    leave.getNoOfDaysRequested());
        }
        LeaveApplication saved = leaveService.getById(leaveId);
        auditLogService.log(
                leave.getEmpId(),
                leaveId,
                decision.name(),
                request.comment() == null
                        ? "Manager decision recorded"
                        : request.comment());
        notificationService.create(
                leave.getEmpId(),
                approve
                        ? NotificationType.LEAVE_APPROVED
                        : NotificationType.LEAVE_REJECTED,
                "Your leave request was "
                        + decision.name().toLowerCase());
        return saveStatus(saved);
    }
    private LeaveApplication saveStatus(LeaveApplication leave) {
        return leaveService.getById(leave.getLeaveId());
    }
}