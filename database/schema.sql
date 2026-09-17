-- ===================================================================
-- Database Creation Script for Student Management System
-- Database Name: student_management
-- ===================================================================

CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

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

INSERT INTO students (roll_number, name, email, phone, department, academic_year, section, date_of_birth, address)
VALUES 
('24CSE101', 'Aarav Sharma', 'aarav.sharma@college.edu', '9876543210', 'Computer Science and Engineering', '1st Year', 'A', '2005-04-14', '42 Blossom Grove, Tech Park Road, Bengaluru'),
('23IT205', 'Diya Patel', 'diya.patel@college.edu', '9845123456', 'Information Technology', '2nd Year', 'B', '2004-11-22', '15 Lotus Avenue, Satellite Road, Ahmedabad'),
('22ECE310', 'Rohan Verma', 'rohan.verma@college.edu', '9123456780', 'Electronics & Communication', '3rd Year', 'A', '2003-08-19', '88 Cyber City Heights, Sector 21, Gurugram'),
('21MECH402', 'Ananya Iyer', 'ananya.iyer@college.edu', '9789012345', 'Mechanical Engineering', '4th Year', 'A', '2002-06-30', '24 Temple View Colony, Mylapore, Chennai'),
('24CSE102', 'Kavya Nair', 'kavya.nair@college.edu', '9456789012', 'Computer Science and Engineering', '1st Year', 'B', '2005-09-08', '12 Marine Vista, Marine Drive, Kochi');

SELECT * FROM students;
