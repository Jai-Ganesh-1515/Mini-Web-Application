export interface ProjectFile {
  path: string;
  name: string;
  category: 'backend' | 'frontend' | 'database' | 'config' | 'docs';
  language: string;
  content: string;
  description: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'backend/pom.xml',
    name: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven dependencies configuration with Spring Boot 3.2.x, JDK 21, Spring Data JPA, Spring Web, Validation, MySQL Connector, and Lombok.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>student-management</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>student-management</name>
    <description>Student Management System - CRUD Based Web Application</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Web: For building RESTful web services -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA: For database access via Hibernate ORM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Validation: @NotBlank, @Email, @Size annotations -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL JDBC Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot DevTools (Optional for hot reload) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'backend/src/main/resources/application.properties',
    name: 'application.properties',
    category: 'config',
    language: 'properties',
    description: 'Database connection properties for MySQL, Hibernate DDL auto configuration, and server port 8080.',
    content: `# ===================================================================
# Spring Boot Configuration for Student Management System
# ===================================================================

# Server Port
server.port=8080

# ===================================================================
# MySQL Database Configuration
# NOTE: Replace 'root' and 'your_mysql_password' with your credentials
# ===================================================================
spring.datasource.url=jdbc:mysql://localhost:3306/student_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===================================================================
# JPA / Hibernate Configuration
# update: automatically creates or updates tables based on Student entity
# ===================================================================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Jackson Date Formatting
spring.jackson.date-format=yyyy-MM-dd
spring.jackson.time-zone=UTC`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/StudentManagementApplication.java',
    name: 'StudentManagementApplication.java',
    category: 'backend',
    language: 'java',
    description: 'Main Spring Boot entry point class annotated with @SpringBootApplication.',
    content: `package com.example.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class to bootstrap the Spring Boot Student Management System.
 */
@SpringBootApplication
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Student Management System Backend Started!");
        System.out.println(" Access REST API at: http://localhost:8080/api/students");
        System.out.println("=================================================");
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/entity/Student.java',
    name: 'Student.java',
    category: 'backend',
    language: 'java',
    description: 'JPA Entity class representing the students table with primary key, unique constraints, and validation annotations.',
    content: `package com.example.studentmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Entity class representing a Student in the database.
 * Maps to 'students' table in MySQL.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Roll number is mandatory")
    @Size(min = 3, max = 20, message = "Roll number must be between 3 and 20 characters")
    @Column(name = "roll_number", nullable = false, unique = true, length = 20)
    private String rollNumber;

    @NotBlank(message = "Student name is mandatory")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be a valid 10-digit number")
    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @NotBlank(message = "Department is mandatory")
    @Column(name = "department", nullable = false, length = 60)
    private String department;

    @NotBlank(message = "Academic year is mandatory")
    @Column(name = "academic_year", nullable = false, length = 20)
    private String year;

    @NotBlank(message = "Section is mandatory")
    @Column(name = "section", nullable = false, length = 10)
    private String section;

    @NotNull(message = "Date of birth is mandatory")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "address", length = 255)
    private String address;

    // Default Constructor required by JPA
    public Student() {
    }

    // Parameterized Constructor
    public Student(String rollNumber, String name, String email, String phone, 
                   String department, String year, String section, 
                   LocalDate dateOfBirth, String address) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.year = year;
        this.section = section;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/repository/StudentRepository.java',
    name: 'StudentRepository.java',
    category: 'backend',
    language: 'java',
    description: 'Spring Data JPA repository interface extending JpaRepository with finder methods for roll number and search queries.',
    content: `package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Student database operations.
 * Extends Spring Data JpaRepository to provide out-of-the-box CRUD operations.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find student by unique roll number
    Optional<Student> findByRollNumber(String rollNumber);

    // Check if roll number already exists (useful for validation)
    boolean existsByRollNumber(String rollNumber);

    // Search students by name or roll number ignoring case
    List<Student> findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(String name, String rollNumber);

    // Find students by department
    List<Student> findByDepartmentIgnoreCase(String department);
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/service/StudentService.java',
    name: 'StudentService.java',
    category: 'backend',
    language: 'java',
    description: 'Service interface defining the business contract for all Student CRUD operations.',
    content: `package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import java.util.List;

/**
 * Service interface defining business operations for Student entity.
 */
public interface StudentService {

    // Create a new student
    Student createStudent(Student student);

    // Retrieve all students
    List<Student> getAllStudents();

    // Retrieve student by ID
    Student getStudentById(Long id);

    // Update existing student by ID
    Student updateStudent(Long id, Student studentDetails);

    // Delete student by ID
    void deleteStudent(Long id);

    // Search students by query term (name or roll number)
    List<Student> searchStudents(String query);
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/service/impl/StudentServiceImpl.java',
    name: 'StudentServiceImpl.java',
    category: 'backend',
    language: 'java',
    description: 'Implementation of StudentService containing business logic, duplicate roll number validation, and exception throwing.',
    content: `package com.example.studentmanagement.service.impl;

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

/**
 * Implementation of StudentService interface.
 * Encapsulates all business rules and database transactions.
 */
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
        // Business Rule: Roll number must be unique
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
        // 1. Check if student exists
        Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        // 2. Check if roll number changed and if it conflicts with another student
        if (!existingStudent.getRollNumber().equalsIgnoreCase(studentDetails.getRollNumber())) {
            Optional<Student> studentWithRoll = studentRepository.findByRollNumber(studentDetails.getRollNumber());
            if (studentWithRoll.isPresent() && !studentWithRoll.get().getId().equals(id)) {
                throw new DuplicateResourceException(
                    "Roll number " + studentDetails.getRollNumber() + " is already assigned to another student"
                );
            }
        }

        // 3. Update all fields
        existingStudent.setRollNumber(studentDetails.getRollNumber());
        existingStudent.setName(studentDetails.getName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setPhone(studentDetails.getPhone());
        existingStudent.setDepartment(studentDetails.getDepartment());
        existingStudent.setYear(studentDetails.getYear());
        existingStudent.setSection(studentDetails.getSection());
        existingStudent.setDateOfBirth(studentDetails.getDateOfBirth());
        existingStudent.setAddress(studentDetails.getAddress());

        // 4. Save and return updated entity
        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        // Check existence before deleting
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
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/controller/StudentController.java',
    name: 'StudentController.java',
    category: 'backend',
    language: 'java',
    description: 'REST Controller exposing endpoints for Create (POST), Read All (GET), Read One (GET), Update (PUT), Delete (DELETE), and Search.',
    content: `package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing CRUD endpoints for Student management.
 * Maps requests to /api/students.
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Allows calls from frontend running on any port/server
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * CREATE - Add new student
     * POST /api/students
     */
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.createStudent(student);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    /**
     * READ ALL - Retrieve all students
     * GET /api/students
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * READ ONE - Retrieve student by ID
     * GET /api/students/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable("id") Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * UPDATE - Modify student by ID
     * PUT /api/students/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable("id") Long id,
            @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return ResponseEntity.ok(updatedStudent);
    }

    /**
     * DELETE - Remove student by ID
     * DELETE /api/students/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Student deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }

    /**
     * SEARCH - Search students by name or roll number
     * GET /api/students/search?name={value}
     */
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam(value = "name", required = false) String name) {
        List<Student> results = studentService.searchStudents(name);
        return ResponseEntity.ok(results);
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/exception/ResourceNotFoundException.java',
    name: 'ResourceNotFoundException.java',
    category: 'backend',
    language: 'java',
    description: 'Custom exception thrown when a student record is not found with given identifier.',
    content: `package com.example.studentmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when requested resource is not found in database.
 * Returns HTTP 404 NOT FOUND.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/exception/DuplicateResourceException.java',
    name: 'DuplicateResourceException.java',
    category: 'backend',
    language: 'java',
    description: 'Custom exception thrown when a unique constraint like rollNumber is violated.',
    content: `package com.example.studentmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when attempting to insert a duplicate unique resource.
 * Returns HTTP 409 CONFLICT.
 */
@ResponseStatus(value = HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/exception/ErrorDetails.java',
    name: 'ErrorDetails.java',
    category: 'backend',
    language: 'java',
    description: 'Standard JSON error response payload containing timestamp, status code, error, message, and path.',
    content: `package com.example.studentmanagement.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response model returned to clients upon exceptions.
 */
public class ErrorDetails {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;

    public ErrorDetails() {
    }

    public ErrorDetails(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/exception/GlobalExceptionHandler.java',
    name: 'GlobalExceptionHandler.java',
    category: 'backend',
    language: 'java',
    description: 'ControllerAdvice class that centralizes exception handling for 400, 404, 409, and 500 error responses.',
    content: `package com.example.studentmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler to intercept exceptions and return structured JSON responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException -> 404 NOT FOUND
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        ErrorDetails error = new ErrorDetails(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Handle DuplicateResourceException -> 409 CONFLICT
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorDetails> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {

        ErrorDetails error = new ErrorDetails(
            LocalDateTime.now(),
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // Handle Validation Errors from @Valid annotations -> 400 BAD REQUEST
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ErrorDetails error = new ErrorDetails(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Validation failed for one or more fields",
            request.getDescription(false).replace("uri=", "")
        );
        error.setValidationErrors(fieldErrors);

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Handle General Exceptions -> 500 INTERNAL SERVER ERROR
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(
            Exception ex, WebRequest request) {

        ErrorDetails error = new ErrorDetails(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}`
  },
  {
    path: 'backend/src/main/java/com/example/studentmanagement/config/CorsConfig.java',
    name: 'CorsConfig.java',
    category: 'config',
    language: 'java',
    description: 'Cross-Origin Resource Sharing (CORS) configuration enabling frontend client access from browsers.',
    content: `package com.example.studentmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration to allow frontend web applications (e.g. running on
 * http://localhost:3000, 5500 Live Server, or file://) to interact with the Spring Boot REST API.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // Allows any origin; can restrict to http://127.0.0.1:5500 in production
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}`
  },
  {
    path: 'database/schema.sql',
    name: 'schema.sql',
    category: 'database',
    language: 'sql',
    description: 'MySQL database creation script with table schema, unique constraints, and sample student records.',
    content: `-- ===================================================================
-- Database Creation Script for Student Management System
-- Database Name: student_management
-- ===================================================================

-- 1. Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS student_management;

-- 2. Switch to the newly created database
USE student_management;

-- 3. Create the 'students' table with proper data types & constraints
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(60) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Insert initial seed data for testing
INSERT INTO students (roll_number, name, email, phone, department, academic_year, section, date_of_birth, address)
VALUES 
('24CSE101', 'Aarav Sharma', 'aarav.sharma@college.edu', '9876543210', 'Computer Science and Engineering', '1st Year', 'A', '2005-04-14', '42 Blossom Grove, Tech Park Road, Bengaluru'),
('23IT205', 'Diya Patel', 'diya.patel@college.edu', '9845123456', 'Information Technology', '2nd Year', 'B', '2004-11-22', '15 Lotus Avenue, Satellite Road, Ahmedabad'),
('22ECE310', 'Rohan Verma', 'rohan.verma@college.edu', '9123456780', 'Electronics & Communication', '3rd Year', 'A', '2003-08-19', '88 Cyber City Heights, Sector 21, Gurugram'),
('21MECH402', 'Ananya Iyer', 'ananya.iyer@college.edu', '9789012345', 'Mechanical Engineering', '4th Year', 'A', '2002-06-30', '24 Temple View Colony, Mylapore, Chennai'),
('24CSE102', 'Kavya Nair', 'kavya.nair@college.edu', '9456789012', 'Computer Science and Engineering', '1st Year', 'B', '2005-09-08', '12 Marine Vista, Marine Drive, Kochi');

-- Verify inserted records
SELECT * FROM students;`
  },
  {
    path: 'frontend/index.html',
    name: 'index.html',
    category: 'frontend',
    language: 'html',
    description: 'Pure HTML5 and Bootstrap 5 responsive frontend single-page application with dashboard, table, modals, and notifications.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
        <div class="container-fluid px-4">
            <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
                <i class="bi bi-mortarboard-fill fs-4"></i>
                <span>Student Management System</span>
            </a>
            <span class="badge bg-white/20 text-white rounded-pill px-3 py-2 fw-semibold">
                Academic Portal
            </span>
        </div>
    </nav>

    <div class="container-fluid px-4 py-4">
        <!-- Toast Notification Alert -->
        <div id="alertContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;"></div>

        <!-- Dashboard Metrics Cards -->
        <div class="row g-3 mb-4">
            <div class="col-sm-6 col-lg-3">
                <div class="card stat-card border-0 shadow-sm rounded-4 h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <p class="text-muted mb-1 text-uppercase fw-semibold small">Total Students</p>
                            <h2 class="fw-bold mb-0 text-primary" id="metricTotalStudents">0</h2>
                        </div>
                        <div class="stat-icon bg-primary-subtle text-primary rounded-circle p-3">
                            <i class="bi bi-people-fill fs-3"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-6 col-lg-3">
                <div class="card stat-card border-0 shadow-sm rounded-4 h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <p class="text-muted mb-1 text-uppercase fw-semibold small">Departments</p>
                            <h2 class="fw-bold mb-0 text-success" id="metricDepartments">0</h2>
                        </div>
                        <div class="stat-icon bg-success-subtle text-success rounded-circle p-3">
                            <i class="bi bi-buildings-fill fs-3"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-6 col-lg-3">
                <div class="card stat-card border-0 shadow-sm rounded-4 h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <p class="text-muted mb-1 text-uppercase fw-semibold small">Academic Years</p>
                            <h2 class="fw-bold mb-0 text-warning" id="metricYears">0</h2>
                        </div>
                        <div class="stat-icon bg-warning-subtle text-warning rounded-circle p-3">
                            <i class="bi bi-calendar3 fs-3"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-6 col-lg-3">
                <div class="card stat-card border-0 shadow-sm rounded-4 h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <p class="text-muted mb-1 text-uppercase fw-semibold small">Active Sections</p>
                            <h2 class="fw-bold mb-0 text-info" id="metricSections">0</h2>
                        </div>
                        <div class="stat-icon bg-info-subtle text-info rounded-circle p-3">
                            <i class="bi bi-layers-fill fs-3"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Student Table Card -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-white py-3 px-4 border-0 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <div>
                    <h5 class="fw-bold mb-0 text-dark">Student Directory</h5>
                    <small class="text-muted">Manage all registered students, inspect profiles, and execute CRUD actions</small>
                </div>

                <!-- Search Input Bar -->
                <div class="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0" style="min-width: 320px;">
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
                        <input type="text" id="searchInput" class="form-control bg-light border-0" placeholder="Search by name or roll number...">
                        <button class="btn btn-outline-secondary border-0 bg-light" type="button" id="clearSearchBtn" title="Clear Search">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Student Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" id="studentTable">
                    <thead class="table-light text-secondary">
                        <tr>
                            <th class="ps-4">ID</th>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Year / Section</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="studentTableBody">
                        <tr>
                            <td colspan="8" class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-2 text-muted mb-0">Loading students from API...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="text-center py-5 d-none">
                <i class="bi bi-mortarboard text-muted display-4"></i>
                <h6 class="mt-3 fw-semibold text-secondary">No students found</h6>
                <p class="text-muted small">Try adjusting your search criteria or register a new student.</p>
            </div>
        </div>
    </div>

    <!-- ADD / EDIT STUDENT MODAL -->
    <div class="modal fade" id="studentModal" tabindex="-1" aria-labelledby="studentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header bg-primary text-white border-0 py-3 px-4">
                    <h5 class="modal-title fw-bold" id="studentModalLabel">Add New Student</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="studentForm" novalidate>
                    <input type="hidden" id="studentId">
                    <div class="modal-body px-4 py-3">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Roll Number <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="rollNumber" placeholder="e.g. 24CSE101" required>
                                <div class="invalid-feedback" id="rollNumberFeedback">Please enter a valid roll number.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="name" placeholder="e.g. Aarav Sharma" required>
                                <div class="invalid-feedback" id="nameFeedback">Student name is required.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="email" placeholder="e.g. student@college.edu" required>
                                <div class="invalid-feedback" id="emailFeedback">Valid email address is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Phone Number <span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="phone" placeholder="10-digit number" required>
                                <div class="invalid-feedback" id="phoneFeedback">Valid 10-digit phone number is required.</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Department <span class="text-danger">*</span></label>
                                <select class="form-select" id="department" required>
                                    <option value="">Select Department</option>
                                    <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                                    <option value="Cyber Security">Cyber Security</option>
                                    <option value="Electronics & Communication Engineering">Electronics & Communication</option>
                                    <option value="Electrical & Electronics Engineering">Electrical & Electronics</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="Biotechnology">Biotechnology</option>
                                    <option value="Aerospace Engineering">Aerospace Engineering</option>
                                    <option value="Robotics & Automation">Robotics & Automation</option>
                                    <option value="Chemical Engineering">Chemical Engineering</option>
                                    <option value="Biomedical Engineering">Biomedical Engineering</option>
                                    <option value="Automobile Engineering">Automobile Engineering</option>
                                </select>
                                <div class="invalid-feedback">Please select a department.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Academic Year <span class="text-danger">*</span></label>
                                <select class="form-select" id="year" required>
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                                <div class="invalid-feedback">Please select an academic year.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Section <span class="text-danger">*</span></label>
                                <select class="form-select" id="section" required>
                                    <option value="">Select Section</option>
                                    <option value="A">Section A</option>
                                    <option value="B">Section B</option>
                                    <option value="C">Section C</option>
                                    <option value="D">Section D</option>
                                    <option value="E">Section E</option>
                                    <option value="F">Section F</option>
                                    <option value="G">Section G</option>
                                    <option value="H">Section H</option>
                                    <option value="I">Section I</option>
                                    <option value="J">Section J</option>
                                </select>
                                <div class="invalid-feedback">Please select a section.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Date of Birth <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="dateOfBirth" required>
                                <div class="invalid-feedback">Date of birth is required.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Address (Optional)</label>
                                <input type="text" class="form-control" id="address" placeholder="Residential city or address">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 px-4 pb-4">
                        <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-semibold" id="submitBtn">
                            Save Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- VIEW STUDENT DETAILS MODAL -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold text-primary">Student Profile</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4 text-center" id="viewModalBody">
                    <!-- Populated dynamically via script.js -->
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow rounded-4">
                <div class="modal-body p-4 text-center">
                    <div class="text-danger mb-3">
                        <i class="bi bi-exclamation-triangle-fill display-4"></i>
                    </div>
                    <h5 class="fw-bold mb-2">Delete Student?</h5>
                    <p class="text-muted mb-4">Are you sure you want to delete this student record? This action cannot be undone.</p>
                    <div class="alert alert-light border text-start p-3 mb-4 rounded-3" id="deleteStudentInfo"></div>
                    <div class="d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger rounded-pill px-4 fw-semibold" id="confirmDeleteBtn">
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="script.js"></script>
</body>
</html>`
  },
  {
    path: 'frontend/style.css',
    name: 'style.css',
    category: 'frontend',
    language: 'css',
    description: 'Custom CSS styling with modern color palette, smooth transitions, card elevation, and responsive table styling.',
    content: `/* Student Management System - Custom CSS */
body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background-color: #f4f6f9;
    color: #1e293b;
}

.stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #ffffff;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.06) !important;
}

.stat-icon {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.table > :not(caption) > * > * {
    padding: 1rem 1rem;
}

.table-hover tbody tr:hover {
    background-color: #f8fafc;
}

.badge-dept {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.4em 0.8em;
}

.action-btn {
    width: 34px;
    height: 34px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.15s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

.avatar-initials {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e2e8f0;
    color: #334155;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
}

.form-control:focus, .form-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.15);
}

@media (max-width: 768px) {
    .table-responsive {
        font-size: 0.875rem;
    }
}`
  },
  {
    path: 'frontend/script.js',
    name: 'script.js',
    category: 'frontend',
    language: 'javascript',
    description: 'Pure JavaScript client handling fetch() requests to Spring Boot REST API for all CRUD operations, dynamic dashboard updates, and validation.',
    content: `/**
 * Student Management System - Frontend JavaScript
 * Communicates with Spring Boot REST API: http://localhost:8080/api/students
 */

const API_BASE_URL = 'http://localhost:8080/api/students';

// State
let studentsList = [];
let deleteTargetId = null;

// Modals
let studentModalInstance = null;
let viewModalInstance = null;
let deleteModalInstance = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap modals
    studentModalInstance = new bootstrap.Modal(document.getElementById('studentModal'));
    viewModalInstance = new bootstrap.Modal(document.getElementById('viewModal'));
    deleteModalInstance = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Event Listeners
    document.getElementById('studentForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        renderStudentsTable(studentsList);
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);

    // Initial Fetch
    fetchAllStudents();
});

/**
 * READ ALL - Fetch all students from backend
 */
async function fetchAllStudents() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(\`Server error: \${response.status}\`);
        }
        studentsList = await response.json();
        updateDashboard(studentsList);
        renderStudentsTable(studentsList);
    } catch (error) {
        console.error('Error fetching students:', error);
        showAlert('Could not connect to Spring Boot server. Please make sure backend is running on http://localhost:8080.', 'danger');
        document.getElementById('studentTableBody').innerHTML = \`
            <tr>
                <td colspan="8" class="text-center py-4 text-danger">
                    <i class="bi bi-wifi-off fs-3 d-block mb-2"></i>
                    Failed to load students. Backend server at \${API_BASE_URL} unreachable.
                </td>
            </tr>
        \`;
    }
}

/**
 * Render students into the HTML table
 */
function renderStudentsTable(students) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!students || students.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');
    tbody.innerHTML = students.map(student => {
        const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return \`
            <tr>
                <td class="ps-4 text-muted fw-semibold">#\${student.id}</td>
                <td>
                    <span class="badge bg-light text-dark border font-monospace px-2 py-1">
                        \${student.rollNumber}
                    </span>
                </td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-initials">\${initials}</div>
                        <div>
                            <div class="fw-bold">\${escapeHtml(student.name)}</div>
                            <small class="text-muted">\${escapeHtml(student.email)}</small>
                        </div>
                    </div>
                </td>
                <td>\${escapeHtml(student.email)}</td>
                <td>\${escapeHtml(student.phone)}</td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill badge-dept">
                        \${escapeHtml(student.department)}
                    </span>
                </td>
                <td>\${escapeHtml(student.year)} - Sec \${escapeHtml(student.section)}</td>
                <td class="text-end pe-4">
                    <div class="btn-group gap-1">
                        <button class="btn btn-sm btn-outline-primary action-btn" title="View Details" onclick="viewStudentDetails(\${student.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning action-btn" title="Edit Student" onclick="openEditStudentModal(\${student.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger action-btn" title="Delete Student" onclick="openDeleteModal(\${student.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        \`;
    }).join('');
}

/**
 * Update Dashboard metrics
 */
function updateDashboard(students) {
    const totalCount = Array.isArray(students) ? students.length : 0;
    const uniqueDepts = new Set((students || []).map(s => s.department).filter(Boolean));
    const uniqueYears = new Set((students || []).map(s => s.year).filter(Boolean));
    const uniqueSections = new Set((students || []).map(s => s.section).filter(Boolean));

    const totalEl = document.getElementById('metricTotalStudents');
    if (totalEl) totalEl.innerText = totalCount;

    const deptEl = document.getElementById('metricDepartments');
    if (deptEl) deptEl.innerText = uniqueDepts.size;

    const yearEl = document.getElementById('metricYears');
    if (yearEl) yearEl.innerText = uniqueYears.size;

    const secEl = document.getElementById('metricSections');
    if (secEl) secEl.innerText = uniqueSections.size;
}

/**
 * Search filter handler
 */
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderStudentsTable(studentsList);
        return;
    }
    const filtered = studentsList.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );
    renderStudentsTable(filtered);
}

/**
 * Open Modal in Add Mode
 */
function openAddStudentModal() {
    document.getElementById('studentModalLabel').innerText = 'Add New Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('submitBtn').innerText = 'Save Student';
    clearValidation();
}

/**
 * EDIT - Retrieve selected student & populate form
 */
async function openEditStudentModal(id) {
    clearValidation();
    try {
        const response = await fetch(\`\${API_BASE_URL}/\${id}\`);
        if (!response.ok) throw new Error('Student not found');
        const student = await response.json();

        document.getElementById('studentModalLabel').innerText = 'Edit Student Details';
        document.getElementById('studentId').value = student.id;
        document.getElementById('rollNumber').value = student.rollNumber;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;
        document.getElementById('department').value = student.department;
        document.getElementById('year').value = student.year;
        document.getElementById('section').value = student.section;
        document.getElementById('dateOfBirth').value = student.dateOfBirth;
        document.getElementById('address').value = student.address || '';

        document.getElementById('submitBtn').innerText = 'Update Student';
        studentModalInstance.show();
    } catch (error) {
        showAlert('Could not load student details for editing.', 'danger');
    }
}

/**
 * Form Submission (CREATE or UPDATE)
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const studentId = document.getElementById('studentId').value;
    const isEdit = Boolean(studentId);

    const payload = {
        rollNumber: document.getElementById('rollNumber').value.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        department: document.getElementById('department').value,
        year: document.getElementById('year').value,
        section: document.getElementById('section').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        address: document.getElementById('address').value.trim()
    };

    const url = isEdit ? \`\${API_BASE_URL}/\${studentId}\` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 409) {
            document.getElementById('rollNumber').classList.add('is-invalid');
            document.getElementById('rollNumberFeedback').innerText = result.message || 'Duplicate roll number!';
            return;
        }

        if (!response.ok) {
            showAlert(result.message || 'Operation failed. Please check inputs.', 'danger');
            return;
        }

        studentModalInstance.hide();
        showAlert(isEdit ? 'Student updated successfully!' : 'New student registered successfully!', 'success');
        fetchAllStudents();
    } catch (error) {
        console.error('Submission error:', error);
        showAlert('Error communicating with backend service.', 'danger');
    }
}

/**
 * VIEW - Display full student profile in modal
 */
async function viewStudentDetails(id) {
    try {
        const response = await fetch(\`\${API_BASE_URL}/\${id}\`);
        if (!response.ok) throw new Error('Not found');
        const s = await response.json();

        const body = document.getElementById('viewModalBody');
        body.innerHTML = \`
            <div class="avatar-initials mb-3 mx-auto" style="width:72px; height:72px; font-size:1.8rem; background:#2563eb; color:#fff;">
                \${s.name.charAt(0)}
            </div>
            <h4 class="fw-bold mb-1">\${escapeHtml(s.name)}</h4>
            <span class="badge bg-primary px-3 py-2 rounded-pill font-monospace mb-3">\${s.rollNumber}</span>
            <div class="row g-2 text-start bg-light p-3 rounded-3 mt-2">
                <div class="col-6"><small class="text-muted d-block">Department</small><strong>\${escapeHtml(s.department)}</strong></div>
                <div class="col-6"><small class="text-muted d-block">Year / Section</small><strong>\${s.year} - Sec \${s.section}</strong></div>
                <div class="col-6"><small class="text-muted d-block">Email</small><strong>\${escapeHtml(s.email)}</strong></div>
                <div class="col-6"><small class="text-muted d-block">Phone</small><strong>\${escapeHtml(s.phone)}</strong></div>
                <div class="col-6"><small class="text-muted d-block">Date of Birth</small><strong>\${s.dateOfBirth}</strong></div>
                <div class="col-6"><small class="text-muted d-block">Address</small><strong>\${escapeHtml(s.address || 'N/A')}</strong></div>
            </div>
        \`;
        viewModalInstance.show();
    } catch (err) {
        showAlert('Failed to load student details.', 'danger');
    }
}

/**
 * Open Delete Confirmation Modal
 */
function openDeleteModal(id) {
    const student = studentsList.find(s => s.id === id);
    if (!student) return;
    deleteTargetId = id;
    document.getElementById('deleteStudentInfo').innerHTML = \`
        <strong>\${escapeHtml(student.name)}</strong> (Roll No: \${student.rollNumber})<br>
        <span class="text-muted small">\${escapeHtml(student.department)} - \${student.year}</span>
    \`;
    deleteModalInstance.show();
}

/**
 * DELETE - Send DELETE request to backend
 */
async function executeDelete() {
    if (!deleteTargetId) return;
    try {
        const response = await fetch(\`\${API_BASE_URL}/\${deleteTargetId}\`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Delete failed');
        deleteModalInstance.hide();
        showAlert('Student deleted successfully!', 'success');
        deleteTargetId = null;
        fetchAllStudents();
    } catch (error) {
        showAlert('Failed to delete student from database.', 'danger');
    }
}

/**
 * Client-Side Validation
 */
function validateForm() {
    let isValid = true;
    clearValidation();

    const roll = document.getElementById('rollNumber').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dept = document.getElementById('department').value;
    const year = document.getElementById('year').value;
    const sec = document.getElementById('section').value;
    const dob = document.getElementById('dateOfBirth').value;

    if (!roll) {
        markInvalid('rollNumber', 'Roll number is mandatory.');
        isValid = false;
    }
    if (!name || name.length < 2) {
        markInvalid('name', 'Name must be at least 2 characters.');
        isValid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        markInvalid('email', 'Valid email address is required.');
        isValid = false;
    }
    if (!phone || !/^\\d{10}$/.test(phone)) {
        markInvalid('phone', 'Phone number must be exactly 10 digits.');
        isValid = false;
    }
    if (!dept) {
        document.getElementById('department').classList.add('is-invalid');
        isValid = false;
    }
    if (!year) {
        document.getElementById('year').classList.add('is-invalid');
        isValid = false;
    }
    if (!sec) {
        document.getElementById('section').classList.add('is-invalid');
        isValid = false;
    }
    if (!dob) {
        document.getElementById('dateOfBirth').classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
}

function markInvalid(fieldId, message) {
    const el = document.getElementById(fieldId);
    el.classList.add('is-invalid');
    const feedback = document.getElementById(fieldId + 'Feedback');
    if (feedback) feedback.innerText = message;
}

function clearValidation() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

/**
 * Toast Alert
 */
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alertId = 'alert_' + Date.now();
    const alertHtml = \`
        <div id="\${alertId}" class="alert alert-\${type} alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi \${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
            \${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    \`;
    container.insertAdjacentHTML('beforeend', alertHtml);
    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) bootstrap.Alert.getOrCreateInstance(el).close();
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Complete project documentation, installation steps, MySQL setup, and API specifications.',
    content: `# Student Management System – CRUD Based Web Application

A full-stack, beginner-friendly **Student Management System** developed using **Java, Spring Boot, Spring Data JPA, REST APIs, MySQL**, and a responsive **HTML5/CSS3/JavaScript (Bootstrap 5)** frontend.

---

## 📌 Features

- **Create (POST)**: Add new students with server-side and client-side validation.
- **Read All (GET)**: View all students in a responsive data table.
- **Read One (GET)**: Inspect complete student profile cards.
- **Update (PUT)**: Edit student records with automatic conflict detection.
- **Delete (DELETE)**: Remove student with modal confirmation.
- **Dynamic Search**: Instant search by Student Name, Roll Number, or Department.
- **Exception Handling**: Global centralized exception handler returning standard HTTP status codes (200, 201, 400, 404, 409, 500).
- **CORS Configured**: Allows seamless frontend-to-backend communication.

---

## 🛠️ Technology Stack

- **Backend**: Java 21, Spring Boot 3.2.x, Spring Web, Spring Data JPA, Hibernate
- **Database**: MySQL 8.x (database: \`student_management\`)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5.3
- **Build Tool**: Apache Maven
- **IDE**: Visual Studio Code / IntelliJ IDEA
- **API Testing**: Postman

---

## 🚀 How to Run the Project

### 1. Database Setup (MySQL)
Run the following commands in MySQL Workbench or MySQL Command Line:
\`\`\`sql
CREATE DATABASE student_management;
USE student_management;
\`\`\`

### 2. Backend Setup (Spring Boot)
1. Open \`backend/src/main/resources/application.properties\`.
2. Update \`spring.datasource.username\` and \`spring.datasource.password\` to match your local MySQL credentials.
3. Open the backend folder in VS Code.
4. Run \`mvn spring-boot:run\` or press **F5** with the Java Extension Pack installed.
5. Spring Boot will start on \`http://localhost:8080\`.

### 3. Frontend Setup
1. Open \`frontend/index.html\` using VS Code Live Server (or open directly in any browser).
2. The frontend will communicate directly with \`http://localhost:8080/api/students\`.

---

## 📡 REST API Endpoints

| HTTP Method | Endpoint | Description | Status Code |
|---|---|---|---|
| **POST** | \`/api/students\` | Register a new student | 201 Created |
| **GET** | \`/api/students\` | Retrieve all students | 200 OK |
| **GET** | \`/api/students/{id}\` | Retrieve student by ID | 200 OK / 404 Not Found |
| **PUT** | \`/api/students/{id}\` | Update student details | 200 OK / 400 / 404 / 409 |
| **DELETE** | \`/api/students/{id}\` | Delete student by ID | 200 OK / 404 Not Found |
| **GET** | \`/api/students/search?name=xyz\` | Search students by name or roll number | 200 OK |`
  }
];
