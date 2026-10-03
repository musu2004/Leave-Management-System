package com.nexturn.lms.controller;

import com.nexturn.lms.entity.*;
import com.nexturn.lms.service.*;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin
public class HRController {

    private final LeaveTypeService leaveTypeService;
    private final HolidayService holidayService;
    private final EmployeeService employeeService;
    private final LeaveBalanceService leaveBalanceService;

    public HRController(
            LeaveTypeService leaveTypeService,
            HolidayService holidayService,
            EmployeeService employeeService,
            LeaveBalanceService leaveBalanceService) {

        this.leaveTypeService = leaveTypeService;
        this.holidayService = holidayService;
        this.employeeService = employeeService;
        this.leaveBalanceService = leaveBalanceService;
    }

    // =========================
    // LEAVE TYPE
    // =========================

    @GetMapping("/leave-types")
    public List<LeaveType> leaveTypes() {
        return leaveTypeService.getAll();
    }

    @PostMapping("/leave-types")
    public LeaveType createLeaveType(@RequestBody LeaveType type) {
        return leaveTypeService.save(type);
    }

    // =========================
    // HOLIDAY
    // =========================

    @GetMapping("/holidays")
    public List<Holiday> holidays() {
        return holidayService.getAll();
    }

    @PostMapping("/holidays")
    public Holiday addHoliday(@RequestBody Holiday holiday) {
        return holidayService.save(holiday);
    }

    // =========================
    // EMPLOYEES
    // =========================

    @GetMapping("/employees")
    public List<Employee> employees() {
        return employeeService.getAll();
    }

    // =========================
    // LEAVE BALANCE / ALLOCATION
    // =========================

    @PostMapping("/leave-balances")
    public LeaveBalance allocateLeave(
            @RequestParam Integer empId,
            @RequestParam Integer leaveTypeId,
            @RequestParam Integer year) {

        return leaveBalanceService.initialize(
                empId,
                leaveTypeId,
                year
        );
    }

    @GetMapping("/leave-balances/{empId}/{leaveTypeId}/{year}")
    public LeaveBalance getLeaveBalance(
            @PathVariable Integer empId,
            @PathVariable Integer leaveTypeId,
            @PathVariable Integer year) {

        return leaveBalanceService.get(
                empId,
                leaveTypeId,
                year
        );
    }
}	