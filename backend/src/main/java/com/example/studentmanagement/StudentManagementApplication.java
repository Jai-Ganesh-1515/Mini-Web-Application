package com.example.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Student Management System Backend Started!");
        System.out.println(" REST API URL: http://localhost:8080/api/students");
        System.out.println("=================================================");
    }
}
