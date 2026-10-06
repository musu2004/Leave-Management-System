package com.nexturn.lms.service;

import java.util.List;

import com.nexturn.lms.entity.Employee;

public interface EmployeeService {
    List<Employee> getAll();
    Employee getById(Integer id);
    Employee save(Employee employee);
    void delete(Integer id);
    List<Employee> getTeam(Integer managerId);
    List<Employee> getManagers();
}