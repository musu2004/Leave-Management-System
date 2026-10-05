package com.nexturn.lms.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.dto.LeaveRequest;
import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.entity.LeaveType;
import com.nexturn.lms.enums.LeaveStatus;
import com.nexturn.lms.exception.BusinessException;

@SpringBootTest
@Transactional
class LeaveServiceTest {

    @Autowired
    private LeaveService leaveService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private LeaveTypeService leaveTypeService;
    @Autowired
    private LeaveBalanceService balanceService;

    @Test
    void testApplyLeaveSuccessfully() {

        Employee employee = new Employee();

        employee.setEmpName("Alex");
        employee.setEmail("alex.employee@gmail.com");
        employee.setPhoneNumber("9000000001");
        employee.setDesignation("Developer");
        employee.setDeptId(1);
        employee.setManagerId(100);
        employee.setGender("Male");
        employee.setAddress("Hyderabad");

        Employee savedEmployee =
                employeeService.save(employee);

        LeaveType leaveType = new LeaveType();

        leaveType.setLeaveTypeName("Casual Leave");
        leaveType.setDescription("Leave for JUnit testing");
        leaveType.setAnnualQuota(12);
        leaveType.setAllowNegativeBalance(false);

        LeaveType savedLeaveType =
                leaveTypeService.save(leaveType);

        balanceService.initialize(
                savedEmployee.getEmpId(),
                savedLeaveType.getLeaveTypeId(),
                2026
        );

        LeaveRequest request =
                new LeaveRequest(
                        savedEmployee.getEmpId(),
                        savedLeaveType.getLeaveTypeId(),
                        LocalDate.of(2026, 10, 5),
                        LocalDate.of(2026, 10, 6),
                        "Personal work"
                );

        LeaveApplication result =
                leaveService.apply(request);

        assertNotNull(result);
        assertEquals(
                savedEmployee.getEmpId(),
                result.getEmpId()
        );

        assertEquals(
                savedLeaveType.getLeaveTypeId(),
                result.getLeaveTypeId()
        );

        assertEquals(
                2,
                result.getNoOfDaysRequested()
        );

        assertEquals(
                LeaveStatus.PENDING,
                result.getStatus()
        );
    }

    @Test
    void testInvalidLeaveDates() {

        LeaveRequest request =
                new LeaveRequest(
                        1001,
                        1,
                        LocalDate.of(2026, 10, 10),
                        LocalDate.of(2026, 10, 5),
                        "Invalid dates"
                );

        assertThrows(BusinessException.class,
                () -> leaveService.apply(request)
        );
    }

    @Test
    void testInsufficientLeaveBalance() {

        Employee employee = new Employee();

        employee.setEmpName("Balance Test Employee");
        employee.setEmail("balance.test@gmail.com");
        employee.setPhoneNumber("9000000002");
        employee.setDesignation("Tester");
        employee.setDeptId(10);
        employee.setManagerId(101);
        employee.setGender("Female");
        employee.setAddress("Hyderabad");

        Employee savedEmployee =
                employeeService.save(employee);

        LeaveType leaveType = new LeaveType();

        leaveType.setLeaveTypeName("Limited Leave");
        leaveType.setDescription("Testing insufficient balance");
        leaveType.setAnnualQuota(1);
        leaveType.setAllowNegativeBalance(false);

        LeaveType savedLeaveType =
                leaveTypeService.save(leaveType);

        balanceService.initialize(
                savedEmployee.getEmpId(),
                savedLeaveType.getLeaveTypeId(),
                2026
        );

        LeaveRequest request =
                new LeaveRequest(
                        savedEmployee.getEmpId(),
                        savedLeaveType.getLeaveTypeId(),
                        LocalDate.of(2026, 10, 5),
                        LocalDate.of(2026, 10, 7),
                        "Need leave"
                );

        assertThrows(
                BusinessException.class,
                () -> leaveService.apply(request)
        );
    }
}