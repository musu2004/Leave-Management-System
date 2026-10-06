package com.nexturn.lms.service;

import com.nexturn.lms.dto.LeaveRequest;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.entity.LeaveBalance;
import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.enums.LeaveStatus;
import com.nexturn.lms.enums.NotificationType;
import com.nexturn.lms.exception.BusinessException;
import com.nexturn.lms.exception.ResourceNotFoundException;
import com.nexturn.lms.repository.LeaveRepository;
import com.nexturn.lms.repository.LeaveTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceService balanceService;
    private final HolidayService holidayService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public LeaveServiceImpl(
            LeaveRepository leaveRepository,
            LeaveTypeRepository leaveTypeRepository,
            LeaveBalanceService balanceService,
            HolidayService holidayService,
            AuditLogService auditLogService,
            NotificationService notificationService) {

        this.leaveRepository = leaveRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.balanceService = balanceService;
        this.holidayService = holidayService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public LeaveApplication apply(LeaveRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new BusinessException(
                    "End date cannot be before start date");
        }

        LeaveType type = leaveTypeRepository
                .findById(request.leaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave type not found"));

        int days = workingDays(
                request.startDate(),
                request.endDate());

        if (days <= 0) {
            throw new BusinessException("No working days selected");
        }

        LeaveBalance balance = balanceService.get(
                request.empId(),
                request.leaveTypeId(),
                request.startDate().getYear());

        if (!type.getAllowNegativeBalance()
                && balance.getRemainingDays() < days) {

            throw new BusinessException("Insufficient leave balance");
        }

        LeaveApplication application = new LeaveApplication();
        application.setEmpId(request.empId());
        application.setLeaveTypeId(request.leaveTypeId());
        application.setStartDate(request.startDate());
        application.setEndDate(request.endDate());
        application.setNoOfDaysRequested(days);
        application.setReason(request.reason());
        application.setStatus(LeaveStatus.PENDING);

        LeaveApplication saved = leaveRepository.save(application);

        auditLogService.log(
                request.empId(),
                saved.getLeaveId(),
                "PENDING",
                "Leave application submitted");

        notificationService.create(
                request.empId(),
                NotificationType.LEAVE_SUBMITTED,
                "Leave request submitted successfully");

        return saved;
    }

    @Override
    public List<LeaveApplication> history(Integer empId) {
        return leaveRepository.findByEmpId(empId);
    }

    @Override
    @Transactional
    public LeaveApplication cancel(
            Integer leaveId,
            Integer empId) {

        LeaveApplication leave = getById(leaveId);

        if (!leave.getEmpId().equals(empId)) {
            throw new BusinessException("You cannot cancel this leave");
        }

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException(
                    "Only pending leave can be cancelled");
        }

        leave.setStatus(LeaveStatus.CANCELLED);

        LeaveApplication saved = leaveRepository.save(leave);

        auditLogService.log(
                empId,
                leaveId,
                "CANCELLED",
                "Pending leave cancelled");

        notificationService.create(
                empId,
                NotificationType.LEAVE_CANCELLED,
                "Leave request cancelled");

        return saved;
    }

    @Override
    public LeaveApplication getById(Integer id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave application not found"));
    }

    private int workingDays(LocalDate start, LocalDate end) {
        int count = 0;

        for (LocalDate d = start;
             !d.isAfter(end);
             d = d.plusDays(1)) {

            DayOfWeek day = d.getDayOfWeek();

            if (day != DayOfWeek.SATURDAY
                    && day != DayOfWeek.SUNDAY
                    && !holidayService.isHoliday(d)) {

                count++;
            }
        }

        return count;
    }
}