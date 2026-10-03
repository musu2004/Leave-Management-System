package com.nexturn.lms.service;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.repository.EmployeeRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Get all employees
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    // Create / Update employee
    @Transactional
    public Employee save(Employee employee) {

        // Generate 4-digit employee ID automatically
        if (employee.getEmpId() == null) {

            Integer maxId = employeeRepository.findMaxEmpId();

            if (maxId == null || maxId < 1000) {
                employee.setEmpId(1000);
            } else {
                employee.setEmpId(maxId + 1);
            }

            entityManager.persist(employee);

            return employee;
        }

        // Update existing employee
        return employeeRepository.save(employee);
    }

    // Delete employee
    public void delete(Integer id) {
        employeeRepository.deleteById(id);
    }

    // Get employees under a manager
    public List<Employee> getTeam(Integer managerId) {
        return employeeRepository.findByManagerId(managerId);
    }
}