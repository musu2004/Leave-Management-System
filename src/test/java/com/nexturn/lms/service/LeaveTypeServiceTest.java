package com.nexturn.lms.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.nexturn.lms.entity.LeaveType;

@SpringBootTest
@Transactional
class LeaveTypeServiceTest {

    @Autowired
    private LeaveTypeService leaveTypeService;

    @Test
    void testSaveLeaveType() {

        LeaveType type = new LeaveType();

        type.setLeaveTypeName("JUnit Leave");
        type.setDescription("Testing leave type");
        type.setAnnualQuota(12);
        type.setAllowNegativeBalance(false);

        LeaveType saved =leaveTypeService.save(type);

        assertNotNull(saved);
        assertNotNull(saved.getLeaveTypeId());
        assertEquals("JUnit Leave",saved.getLeaveTypeName());
        assertEquals(12, saved.getAnnualQuota());
    }

    @Test
    void testGetAllLeaveTypes() {

        List<LeaveType> types =leaveTypeService.getAll();
        assertNotNull(types);
    }

    @Test
    void testGetLeaveTypeById() {

        LeaveType type = new LeaveType();

        type.setLeaveTypeName("Find Leave");
        type.setDescription("Testing find");
        type.setAnnualQuota(10);
        type.setAllowNegativeBalance(false);

        LeaveType saved =leaveTypeService.save(type);

        LeaveType result =leaveTypeService.getById(
        		saved.getLeaveTypeId()
                );
        assertNotNull(result);
        assertEquals(
                saved.getLeaveTypeId(),
                result.getLeaveTypeId()
        );
    }
}