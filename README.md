# Student Management System – CRUD Based Web Application

A full-stack, enterprise-grade **Student Management System** developed with **Spring Boot 3 (Java 21)**, **MySQL 8.0**, and a responsive **HTML5/CSS3/JavaScript (Bootstrap 5)** frontend.

---

## 📌 Features & Capabilities

- **Create Student (POST):** Register student with validation (Roll Number, Name, Email, 10-digit Phone, Department, Year, Section, DOB, Address).
- **Read All Students (GET):** Display student directory in a responsive table with department badges and profile avatars.
- **Read One Student (GET by ID):** Inspect individual student records in a detailed modal card with computed age and copyable JSON.
- **Update Student (PUT):** Edit personal and academic information with validation and duplicate roll number protection.
- **Delete Student (DELETE):** Confirmation dialog before irreversible removal.
- **Instant Search:** Real-time client & server filtering by student name or roll number.
- **Interactive REST API Tester:** Built-in Postman-style simulator to execute requests and inspect response payloads.
- **Code Explorer:** 100% complete source code with copy and download utilities.

---

## 🚀 Quick Setup & Execution Guide

### 1. Prerequisites
- **JDK 21** or later ([Download Eclipse Temurin or Oracle JDK](https://adoptium.net/))
- **MySQL Server 8.0+** & MySQL Workbench ([Download MySQL](https://dev.mysql.com/downloads/installer/))
- **Visual Studio Code** with:
  - *Extension Pack for Java* (Microsoft)
  - *Spring Boot Extension Pack* (VMware)
  - *Live Server* (Ritwick Dey)

---

### 2. MySQL Database Setup
Open MySQL command prompt or Workbench and run:

```sql
CREATE DATABASE student_management;
USE student_management;

-- Note: Spring Boot automatically creates the 'students' table on startup 
-- via spring.jpa.hibernate.ddl-auto=update.
-- If you wish to seed sample data manually, execute database/schema.sql.
```

---

### 3. Backend Configuration & Launch (Spring Boot)

1. Open `backend/src/main/resources/application.properties`.
2. Update your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Open a terminal in the `backend/` directory and run:
   ```bash
   mvn spring-boot:run
   ```
   Or open `StudentManagementApplication.java` in VS Code and click **Run**.
4. The backend will boot up at **`http://localhost:8080/api/students`**.

---

### 4. Frontend Launch (HTML5 / Bootstrap 5)

1. In VS Code, navigate to the `frontend/` folder.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. Your browser will open the frontend application at **`http://127.0.0.1:5500`**.
4. All CRUD actions executed in the frontend will persist directly into MySQL.

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/students` | Register a new student | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `GET` | `/api/students` | Retrieve all student records | `200 OK` |
| `GET` | `/api/students/{id}` | Retrieve single student by ID | `200 OK`, `404 Not Found` |
| `PUT` | `/api/students/{id}` | Update existing student record | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/api/students/{id}` | Remove student record | `200 OK`, `404 Not Found` |
| `GET` | `/api/students/search?name={q}` | Search students by query | `200 OK` |

---

## 🧪 Postman Testing Guide

### 1. Create Student (Valid)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/students`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "rollNumber": "24CSE101",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@college.edu",
    "phone": "9876543210",
    "department": "Computer Science and Engineering",
    "year": "1st Year",
    "section": "A",
    "dateOfBirth": "2005-04-14",
    "address": "42 Blossom Grove, Tech Park Road, Bengaluru"
  }
  ```
- **Expected Status:** `201 Created`

### 2. Missing Name Test
- Set `"name": ""` in the body above.
- **Expected Status:** `400 Bad Request` with field validation errors.

### 3. Duplicate Roll Number Test
- Resend `POST` with an already existing roll number (`24CSE101`).
- **Expected Status:** `409 Conflict`.

### 4. Get Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/students/1`
- **Expected Status:** `200 OK` (or `404 Not Found` if nonexistent).

### 5. Update Student
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/students/1`
- **Body:** Same JSON as POST with updated phone or year.
- **Expected Status:** `200 OK`.

### 6. Delete Student
- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/students/1`
- **Expected Status:** `200 OK` with confirmation message.

---

## 🛠️ Project File Structure

```text
student-management-system/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/example/studentmanagement/
│           │   ├── StudentManagementApplication.java
│           │   ├── controller/
│           │   │   └── StudentController.java
│           │   ├── service/
│           │   │   ├── StudentService.java
│           │   │   └── impl/StudentServiceImpl.java
│           │   ├── repository/
│           │   │   └── StudentRepository.java
│           │   ├── entity/
│           │   │   └── Student.java
│           │   ├── exception/
│           │   │   ├── ResourceNotFoundException.java
│           │   │   ├── DuplicateResourceException.java
│           │   │   ├── ErrorDetails.java
│           │   │   └── GlobalExceptionHandler.java
│           │   └── config/
│           │       └── CorsConfig.java
│           └── resources/
│               └── application.properties
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── schema.sql
└── README.md
```
