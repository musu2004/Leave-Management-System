package com.nexturn.lms.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.dto.ApprovalRequest;
import com.nexturn.lms.dto.LeaveRequest;
import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.enums.LeaveStatus;

@SpringBootTest
@Transactional
class ApprovalServiceTest {

    @Autowired
    private ApprovalService approvalService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private LeaveTypeService leaveTypeService;
    @Autowired
    private LeaveBalanceService balanceService;
    @Autowired
    private LeaveService leaveService;

    @Test
    void testApproveLeave() {

        Employee employee = new Employee();

        employee.setEmpName("Approval Employee");
        employee.setEmail("approval.employee@gmail.com");
        employee.setPhoneNumber("9000000020");
        employee.setDesignation("Developer");
        employee.setDeptId(10);
        employee.setManagerId(201);
        employee.setGender("Male");
        employee.setAddress("Hyderabad");

        Employee savedEmployee =
                employeeService.save(employee);

        LeaveType type = new LeaveType();

        type.setLeaveTypeName("Approval Test Leave");
        type.setDescription("Testing approval");
        type.setAnnualQuota(12);
        type.setAllowNegativeBalance(false);

        LeaveType savedType =leaveTypeService.save(type);

        balanceService.initialize(
                savedEmployee.getEmpId(),
                savedType.getLeaveTypeId(),
                2026
        );

        LeaveRequest leaveRequest =
                new LeaveRequest(
                        savedEmployee.getEmpId(),
                        savedType.getLeaveTypeId(),
                        LocalDate.of(2026, 10, 5),
                        LocalDate.of(2026, 10, 6),
                        "Personal work");

        LeaveApplication leave =
                leaveService.apply(leaveRequest);

        assertEquals(
                LeaveStatus.PENDING,
                leave.getStatus()
        );

        ApprovalRequest approvalRequest =
                new ApprovalRequest(
                        201,
                        "Approved by manager"
                );

        LeaveApplication result =
                approvalService.decide(
                        leave.getLeaveId(),
                        approvalRequest,
                        true
                );

        assertEquals(
                LeaveStatus.APPROVED,
                result.getStatus()
        );
    }

    @Test
    void testRejectLeave() {

        Employee employee = new Employee();

        employee.setEmpName("Reject Employee");
        employee.setEmail("reject.employee@gmail.com");
        employee.setPhoneNumber("9000000021");
        employee.setDesignation("Developer");
        employee.setDeptId(10);
        employee.setManagerId(202);
        employee.setGender("Female");
        employee.setAddress("Hyderabad");

        Employee savedEmployee =
                employeeService.save(employee);

        LeaveType type = new LeaveType();

        type.setLeaveTypeName("Reject Test Leave");
        type.setDescription("Testing rejection");
        type.setAnnualQuota(12);
        type.setAllowNegativeBalance(false);

        LeaveType savedType =leaveTypeService.save(type);

        balanceService.initialize(
                savedEmployee.getEmpId(),
                savedType.getLeaveTypeId(),
                2026
        );

        LeaveRequest request =
                new LeaveRequest(
                        savedEmployee.getEmpId(),
                        savedType.getLeaveTypeId(),
                        LocalDate.of(2026, 10, 12),
                        LocalDate.of(2026, 10, 13),
                        "Personal work"
                );

        LeaveApplication leave =leaveService.apply(request);

        ApprovalRequest approvalRequest =
                new ApprovalRequest(
                        202,
                        "Leave rejected"
                );

        LeaveApplication result =
                approvalService.decide(
                        leave.getLeaveId(),
                        approvalRequest,
                        false
                );

        assertEquals(
                LeaveStatus.REJECTED,
                result.getStatus()
        );
    }

    @Test
    void testWrongManagerCannotApprove() {

        Employee employee = new Employee();

        employee.setEmpName("Manager Test Employee");
        employee.setEmail("manager.test@gmail.com");
        employee.setPhoneNumber("9000000022");
        employee.setDesignation("Developer");
        employee.setDeptId(10);
        employee.setManagerId(203);
        employee.setGender("Male");
        employee.setAddress("Hyderabad");

        Employee savedEmployee =
                employeeService.save(employee);

        LeaveType type = new LeaveType();

        type.setLeaveTypeName("Manager Test Leave");
        type.setDescription("Testing manager validation");
        type.setAnnualQuota(12);
        type.setAllowNegativeBalance(false);

        LeaveType savedType =
                leaveTypeService.save(type);

        balanceService.initialize(
                savedEmployee.getEmpId(),
                savedType.getLeaveTypeId(),
                2026
        );

        LeaveRequest request =
                new LeaveRequest(
                        savedEmployee.getEmpId(),
                        savedType.getLeaveTypeId(),
                        LocalDate.of(2026, 10, 19),
                        LocalDate.of(2026, 10, 20),
                        "Personal work"
                );

        LeaveApplication leave = leaveService.apply(request);

        ApprovalRequest wrongManager =
                new ApprovalRequest(
                        999,
                        "Wrong manager"
                );

        assertThrows(
                RuntimeException.class,
                () -> approvalService.decide(
                        leave.getLeaveId(),
                        wrongManager,
                        true
                )
        );
    }
}