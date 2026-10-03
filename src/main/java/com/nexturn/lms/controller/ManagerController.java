package com.nexturn.lms.controller;

import com.nexturn.lms.dto.ApprovalRequest;
import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.service.ApprovalService;
import com.nexturn.lms.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin
public class ManagerController {
    private final ApprovalService approvalService;
    private final EmployeeService employeeService;

    public ManagerController(ApprovalService approvalService, EmployeeService employeeService) {
        this.approvalService = approvalService;
        this.employeeService = employeeService;
    }

    @GetMapping("/{managerId}/team")
    public List<Employee> team(@PathVariable Integer managerId) {
        return employeeService.getTeam(managerId);
    }

    @PostMapping("/leave/{leaveId}/approve")
    public LeaveApplication approve(@PathVariable Integer leaveId,
                                    @Valid @RequestBody ApprovalRequest request) {
        return approvalService.decide(leaveId, request, true);
    }

    @PostMapping("/leave/{leaveId}/reject")
    public LeaveApplication reject(@PathVariable Integer leaveId,
                                   @Valid @RequestBody ApprovalRequest request) {
        return approvalService.decide(leaveId, request, false);
    }
}
