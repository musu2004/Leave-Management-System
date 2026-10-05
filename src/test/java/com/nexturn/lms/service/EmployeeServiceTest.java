package com.nexturn.lms.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.entity.Employee;

@SpringBootTest
@Transactional
class EmployeeServiceTest {

    @Autowired
    private EmployeeService employeeService;

    @Test
    void testSaveEmployee() {

        Employee employee = new Employee();

        employee.setEmpName("rohan");
        employee.setEmail("rohan.employee@gmail.com");
        employee.setPhoneNumber("9000000010");
        employee.setDesignation("Developer");
        employee.setDeptId(4);
        employee.setManagerId(104);
        employee.setGender("Male");
        employee.setAddress("Hyderabad");

        Employee saved =
                employeeService.save(employee);

        assertNotNull(saved);
        assertNotNull(saved.getEmpId());

        assertEquals("rohan",saved.getEmpName());
    }

    @Test
    void testGetAllEmployees() {

        List<Employee> employees = employeeService.getAll();
        assertNotNull(employees);
    }

    @Test
    void testGetEmployeeById() {

        Employee employee = new Employee();

        employee.setEmpName("Find Employee");
        employee.setEmail("find.employee@gmail.com");
        employee.setPhoneNumber("9000000011");
        employee.setDesignation("Tester");
        employee.setDeptId(3);
        employee.setManagerId(102);
        employee.setGender("Female");
        employee.setAddress("Hyderabad");

        Employee saved =
                employeeService.save(employee);

        Employee result =
                employeeService.getById(saved.getEmpId());

        assertNotNull(result);

        assertEquals(
                saved.getEmpId(),
                result.getEmpId()
        );

        assertEquals("Find Employee",result.getEmpName());
    }

    @Test
    void testGetTeam() {

        List<Employee> team =
                employeeService.getTeam(201);

        assertNotNull(team);
    }
}