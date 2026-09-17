package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import java.util.List;

public interface StudentService {

    Student createStudent(Student student);

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    Student updateStudent(Long id, Student studentDetails);

    void deleteStudent(Long id);

    List<Student> searchStudents(String query);
}
