package com.nexturn.lms.controller;

import com.nexturn.lms.dto.LeaveRequest;
import com.nexturn.lms.entity.LeaveApplication;
import com.nexturn.lms.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin
public class LeaveController {
    private final LeaveService service;

    public LeaveController(LeaveService service) { this.service = service; }

    @PostMapping
    public LeaveApplication apply(@Valid @RequestBody LeaveRequest request) {
        return service.apply(request);
    }

    @GetMapping("/{id}")
    public LeaveApplication get(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/employee/{empId}")
    public List<LeaveApplication> history(@PathVariable Integer empId) {
        return service.history(empId);
    }

    @PutMapping("/{leaveId}/cancel/{empId}")
    public LeaveApplication cancel(@PathVariable Integer leaveId, @PathVariable Integer empId) {
        return service.cancel(leaveId, empId);
    }
}

