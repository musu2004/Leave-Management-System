package com.nexturn.lms.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.entity.Employee;
import com.nexturn.lms.enums.Role;
import com.nexturn.lms.repository.EmployeeRepository;
import com.nexturn.lms.repository.LoginRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final LoginRepository loginRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, LoginRepository loginRepository) {
        this.employeeRepository = employeeRepository;
        this.loginRepository = loginRepository;
    }

    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    @Override
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

    @Override
    public void delete(Integer id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public List<Employee> getTeam(Integer managerId) {
        return employeeRepository.findByManagerId(managerId);
    }

    @Override
    public List<Employee> getManagers() {
        Set<String> managerEmails = loginRepository.findByRole(Role.MANAGER).stream()
                .map(l -> l.getUsername().toLowerCase())
                .collect(Collectors.toSet());

        return employeeRepository.findAll().stream()
                .filter(e -> e.getEmail() != null && managerEmails.contains(e.getEmail().toLowerCase()))
                .collect(Collectors.toList());
    }
}