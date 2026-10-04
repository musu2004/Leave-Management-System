package com.nexturn.lms.controller;

import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.service.EmployeeService;
import com.nexturn.lms.service.AuditLogService;
import com.nexturn.lms.entity.Notification;
import com.nexturn.lms.entity.AuditLog;
import com.nexturn.lms.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
public class EmployeeController {

    private final EmployeeService service;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public EmployeeController(
            EmployeeService service,
            NotificationService notificationService,
            AuditLogService auditLogService) {

        this.service = service;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Employee get(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Employee create(@RequestBody Employee employee) {
        return service.save(employee);
    }

    @PutMapping("/{id}")
    public Employee update(
            @PathVariable Integer id,
            @RequestBody Employee employee) {

        employee.setEmpId(id);

        return service.save(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/notifications")
    public List<Notification> notifications(@PathVariable Integer id) {
        return notificationService.getByEmployee(id);
    }

    @GetMapping("/{id}/audit")
    public List<AuditLog> audit(@PathVariable Integer id) {
        return auditLogService.getByEmployee(id);
    }
}