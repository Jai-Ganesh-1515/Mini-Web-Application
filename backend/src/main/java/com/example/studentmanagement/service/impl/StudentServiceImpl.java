package com.example.studentmanagement.service.impl;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.DuplicateResourceException;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Student createStudent(Student student) {
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new DuplicateResourceException(
                "Student already exists with roll number: " + student.getRollNumber()
            );
        }
        return studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        // Check if roll number changed and conflicts with another record
        if (!existingStudent.getRollNumber().equalsIgnoreCase(studentDetails.getRollNumber())) {
            Optional<Student> studentWithRoll = studentRepository.findByRollNumber(studentDetails.getRollNumber());
            if (studentWithRoll.isPresent() && !studentWithRoll.get().getId().equals(id)) {
                throw new DuplicateResourceException(
                    "Roll number " + studentDetails.getRollNumber() + " is already assigned to another student"
                );
            }
        }

        existingStudent.setRollNumber(studentDetails.getRollNumber());
        existingStudent.setName(studentDetails.getName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setPhone(studentDetails.getPhone());
        existingStudent.setDepartment(studentDetails.getDepartment());
        existingStudent.setYear(studentDetails.getYear());
        existingStudent.setSection(studentDetails.getSection());
        existingStudent.setDateOfBirth(studentDetails.getDateOfBirth());
        existingStudent.setAddress(studentDetails.getAddress());

        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        studentRepository.delete(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return studentRepository.findAll();
        }
        return studentRepository.findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
            query.trim(), query.trim()
        );
    }
}
