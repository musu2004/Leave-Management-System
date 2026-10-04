package com.nexturn.lms.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found with ID: " + id));
    }
    
    @Transactional
    public Employee save(Employee employee) {
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

        return employeeRepository.save(employee);
    }

    public void delete(Integer id) {
        employeeRepository.deleteById(id);
    }

    public List<Employee> getTeam(Integer managerId) {
        return employeeRepository.findByManagerId(managerId);
    }
}
