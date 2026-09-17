import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Database, 
  Terminal, 
  CheckSquare, 
  AlertTriangle, 
  GitBranch, 
  ChevronRight,
  ExternalLink,
  Cpu,
  Server,
  FileText
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'er' | 'vscode' | 'mysql' | 'errors' | 'checklist'>('architecture');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Project Documentation & Setup Guide
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete technical specification, ER diagram, layered architecture, VS Code workflow, and viva checklist.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'architecture', label: 'Architecture' },
            { id: 'er', label: 'ER Diagram' },
            { id: 'vscode', label: 'VS Code Setup (18 Steps)' },
            { id: 'mysql', label: 'MySQL Setup' },
            { id: 'errors', label: 'Common Errors' },
            { id: 'checklist', label: 'Demo Checklist' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documentation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {/* SECTION 1: ARCHITECTURE */}
        {activeSection === 'architecture' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Layered Spring Boot Architecture</h3>
              <p className="text-slate-600">
                The Student Management System follows standard enterprise 3-tier layered architecture ensuring strict separation of concerns, maintainability, and testability.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
              <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-2xs w-full md:w-36">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1.5 font-bold">1</div>
                <strong className="block text-slate-900 text-xs">User Interface</strong>
                <span className="text-[10px] text-slate-400">HTML5 + CSS + JS</span>
              </div>

              <div className="text-slate-400 font-mono text-xs hidden md:block">&rarr;</div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs w-full md:w-36">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 font-bold">2</div>
                <strong className="block text-slate-900 text-xs">Controller</strong>
                <span className="text-[10px] text-slate-400">StudentController.java</span>
              </div>

              <div className="text-slate-400 font-mono text-xs hidden md:block">&rarr;</div>

              <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-2xs w-full md:w-36">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-1.5 font-bold">3</div>
                <strong className="block text-slate-900 text-xs">Service Layer</strong>
                <span className="text-[10px] text-slate-400">StudentServiceImpl.java</span>
              </div>

              <div className="text-slate-400 font-mono text-xs hidden md:block">&rarr;</div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs w-full md:w-36">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1.5 font-bold">4</div>
                <strong className="block text-slate-900 text-xs">JPA Repository</strong>
                <span className="text-[10px] text-slate-400">StudentRepository.java</span>
              </div>

              <div className="text-slate-400 font-mono text-xs hidden md:block">&rarr;</div>

              <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs w-full md:w-36">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-1.5 font-bold">5</div>
                <strong className="block text-slate-900 text-xs">MySQL DB</strong>
                <span className="text-[10px] text-slate-400">student_management</span>
              </div>
            </div>

            {/* Layer Details Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Layer Responsibilities Explained</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-blue-700 block mb-1">1. Presentation / Controller Layer</strong>
                  <p className="text-slate-600">
                    Maps incoming HTTP requests (GET, POST, PUT, DELETE) to handlers, executes bean validation (<code>@Valid</code>), and returns HTTP status codes with JSON responses.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-indigo-700 block mb-1">2. Service / Business Logic Layer</strong>
                  <p className="text-slate-600">
                    Enforces core application rules, such as verifying duplicate roll numbers, managing transactions (<code>@Transactional</code>), and throwing custom domain exceptions.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-amber-700 block mb-1">3. Repository / Persistence Layer</strong>
                  <p className="text-slate-600">
                    Extends <code>JpaRepository&lt;Student, Long&gt;</code> to inherit CRUD methods (<code>save</code>, <code>findAll</code>, <code>findById</code>, <code>delete</code>) and derive dynamic queries without boilerplate SQL.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-purple-700 block mb-1">4. Database & Entity Model</strong>
                  <p className="text-slate-600">
                    The <code>Student</code> entity maps directly to the MySQL table <code>students</code>. Hibernate handles automatic DDL generation and schema synchronization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ER DIAGRAM */}
        {activeSection === 'er' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Entity Relationship (ER) Concept</h3>
              <p className="text-slate-600">
                Detailed database representation of the <strong>STUDENT</strong> table in the <code>student_management</code> database.
              </p>
            </div>

            {/* Visual ER Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-slate-800 text-white p-3 font-mono font-bold text-xs flex items-center justify-between">
                <span>TABLE: students</span>
                <span className="text-slate-400 text-[10px]">ENGINE: InnoDB &bull; CHARSET: utf8mb4</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-600 text-[11px]">
                    <th className="p-3">Attribute</th>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Constraints</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className="bg-blue-50/50">
                    <td className="p-3 font-bold text-blue-800">id</td>
                    <td className="p-3">BIGINT AUTO_INCREMENT</td>
                    <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">PRIMARY KEY</span></td>
                    <td className="p-3 font-sans text-slate-600">Surrogate primary key, auto-generated increment</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">roll_number</td>
                    <td className="p-3">VARCHAR(20)</td>
                    <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">UNIQUE, NOT NULL</span></td>
                    <td className="p-3 font-sans text-slate-600">College roll identifier (e.g. 24CSE101)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">name</td>
                    <td className="p-3">VARCHAR(100)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">Full legal student name</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">email</td>
                    <td className="p-3">VARCHAR(100)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">Valid RFC email format</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">phone</td>
                    <td className="p-3">VARCHAR(15)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">10-digit telephone contact number</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">department</td>
                    <td className="p-3">VARCHAR(60)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">Engineering academic discipline</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">academic_year</td>
                    <td className="p-3">VARCHAR(20)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">Current cohort year (1st to 4th Year)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">section</td>
                    <td className="p-3">VARCHAR(10)</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">Assigned classroom section (A, B, C)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">date_of_birth</td>
                    <td className="p-3">DATE</td>
                    <td className="p-3">NOT NULL</td>
                    <td className="p-3 font-sans text-slate-600">ISO-8601 date (YYYY-MM-DD)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">address</td>
                    <td className="p-3">VARCHAR(255)</td>
                    <td className="p-3 text-slate-400">NULLABLE (Optional)</td>
                    <td className="p-3 font-sans text-slate-600">Residential address of student</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">Key Constraints Explained:</strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Primary Key (id):</strong> Guarantees row-level uniqueness and fast index lookups.</li>
                <li><strong>Unique Key (roll_number):</strong> Prevents assigning the same roll number to multiple students, returning HTTP 409 Conflict.</li>
                <li><strong>Mandatory NOT NULL:</strong> Guarantees data integrity for student enrollment records.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 3: 18-STEP VS CODE SETUP */}
        {activeSection === 'vscode' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Complete Beginner VS Code Setup Guide</h3>
              <p className="text-slate-600">
                Step-by-step instructions from installing JDK 21 to testing CRUD and uploading to GitHub.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 'STEP 1',
                  title: 'Install/Check JDK 21',
                  desc: 'Download and install Oracle JDK 21 or Eclipse Temurin OpenJDK 21. Verify in terminal by running: java -version and javac -version. Ensure JAVA_HOME environment variable points to your JDK directory.'
                },
                {
                  step: 'STEP 2',
                  title: 'Install/Check MySQL',
                  desc: 'Install MySQL Server 8.0+ and MySQL Workbench. During installation, set your root password (e.g. root123) and keep port 3306. Verify connection by running: mysql -u root -p'
                },
                {
                  step: 'STEP 3',
                  title: 'Install VS Code Extensions',
                  desc: 'Open VS Code and install these official extensions: "Extension Pack for Java" (Microsoft), "Spring Boot Extension Pack" (VMware), "MySQL" (Weijan Chen), and "Live Server" (Ritwick Dey).'
                },
                {
                  step: 'STEP 4',
                  title: 'Create Spring Boot Project',
                  desc: 'Press Ctrl+Shift+P in VS Code, choose "Spring Initializr: Create a Maven Project". Select Spring Boot 3.2.x, Java, Group "com.example", Artifact "student-management", Packaging "Jar", and Java version "21".'
                },
                {
                  step: 'STEP 5',
                  title: 'Select Dependencies',
                  desc: 'Add the 4 required dependencies: Spring Web, Spring Data JPA, MySQL Driver, and Validation (Bean Validation).'
                },
                {
                  step: 'STEP 6',
                  title: 'Create Packages',
                  desc: 'Inside src/main/java/com/example/studentmanagement/, create packages: controller, service, service.impl, repository, entity, exception, and config.'
                },
                {
                  step: 'STEP 7',
                  title: 'Create Java Files',
                  desc: 'Create Student.java (entity), StudentRepository.java, StudentService.java, StudentServiceImpl.java, StudentController.java, ResourceNotFoundException.java, DuplicateResourceException.java, GlobalExceptionHandler.java, and CorsConfig.java.'
                },
                {
                  step: 'STEP 8',
                  title: 'Configure application.properties',
                  desc: 'In src/main/resources/application.properties, enter spring.datasource.url=jdbc:mysql://localhost:3306/student_management, username, password, and spring.jpa.hibernate.ddl-auto=update.'
                },
                {
                  step: 'STEP 9',
                  title: 'Create MySQL Database',
                  desc: 'In MySQL command line or Workbench, run: CREATE DATABASE student_management; Hibernate will automatically create the students table.'
                },
                {
                  step: 'STEP 10',
                  title: 'Create Frontend Files',
                  desc: 'In the frontend folder, create index.html, style.css, and script.js.'
                },
                {
                  step: 'STEP 11',
                  title: 'Connect Frontend to Backend',
                  desc: 'In script.js, define const API_BASE_URL = "http://localhost:8080/api/students" and use fetch() for all CRUD operations.'
                },
                {
                  step: 'STEP 12',
                  title: 'Run Spring Boot',
                  desc: 'In VS Code terminal in the backend directory, run: mvn spring-boot:run. Verify Spring Boot starts on port 8080.'
                },
                {
                  step: 'STEP 13',
                  title: 'Run Frontend',
                  desc: 'Right-click frontend/index.html and select "Open with Live Server" (runs on http://127.0.0.1:5500).'
                },
                {
                  step: 'STEP 14',
                  title: 'Test CRUD Operations',
                  desc: 'Test in browser: 1. Click "Add Student" to create. 2. View in table. 3. Click Edit icon. 4. Click Delete with confirmation.'
                },
                {
                  step: 'STEP 15',
                  title: 'Test APIs using Postman',
                  desc: 'Create requests in Postman for GET, POST, PUT, and DELETE on http://localhost:8080/api/students.'
                },
                {
                  step: 'STEP 16',
                  title: 'Test Validation',
                  desc: 'Try registering without a name or with an invalid email to observe 400 Bad Request and frontend feedback.'
                },
                {
                  step: 'STEP 17',
                  title: 'Take Screenshots',
                  desc: 'Capture screenshots of: Dashboard, Add modal, Student table, Edit modal, Delete confirmation, Postman requests, and MySQL SELECT query.'
                },
                {
                  step: 'STEP 18',
                  title: 'Upload Project to GitHub',
                  desc: 'Initialize git: git init, git add ., git commit -m "Initial commit", git branch -M main, git remote add origin <url>, and git push -u origin main.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[10px]">
                      {item.step}
                    </span>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                  </div>
                  <p className="text-slate-600 pl-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: MYSQL SETUP */}
        {activeSection === 'mysql' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">MySQL Database Configuration</h3>
              <p className="text-slate-600">
                Execute these SQL statements to initialize your database and verify table creation.
              </p>
            </div>

            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre className="text-emerald-400">
{`-- Step 1: Log in to MySQL terminal
mysql -u root -p

-- Step 2: Create the database
CREATE DATABASE student_management;

-- Step 3: Switch to database
USE student_management;

-- Step 4: Show tables (once Spring Boot runs with ddl-auto=update)
SHOW TABLES;

-- Step 5: Verify table schema
DESCRIBE students;

-- Step 6: Query stored records
SELECT * FROM students;`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <strong className="block mb-1">Where to Enter Username and Password?</strong>
              <p>
                Open <code>backend/src/main/resources/application.properties</code>:
              </p>
              <pre className="font-mono text-[11px] bg-white p-2 rounded border border-amber-300 mt-2 text-slate-800">
{`spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE`}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 5: COMMON ERRORS & SOLUTIONS */}
        {activeSection === 'errors' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Common Errors & Quick Fixes</h3>
              <p className="text-slate-600">
                Troubleshooting guide for typical issues encountered during college lab demonstrations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <strong className="text-rose-900 block font-bold">1. Access Denied for User 'root'@'localhost'</strong>
                <p className="text-rose-800 mt-0.5">
                  <strong>Cause:</strong> Incorrect MySQL password in <code>application.properties</code>.<br/>
                  <strong>Solution:</strong> Verify your MySQL password by testing <code>mysql -u root -p</code> in terminal, then update <code>spring.datasource.password</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <strong className="text-rose-900 block font-bold">2. Unknown Database 'student_management'</strong>
                <p className="text-rose-800 mt-0.5">
                  <strong>Cause:</strong> Spring Boot attempted to connect before the database was created.<br/>
                  <strong>Solution:</strong> Run <code>CREATE DATABASE student_management;</code> in MySQL Workbench before launching Spring Boot.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <strong className="text-rose-900 block font-bold">3. Port 8080 Already in Use (BindException)</strong>
                <p className="text-rose-800 mt-0.5">
                  <strong>Cause:</strong> Another instance of Spring Boot or Oracle/Tomcat is holding port 8080.<br/>
                  <strong>Solution:</strong> Either terminate the conflicting process or change port in <code>application.properties</code> to <code>server.port=8081</code> (and update frontend URL).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <strong className="text-rose-900 block font-bold">4. CORS Policy Blocked / Failed to Fetch</strong>
                <p className="text-rose-800 mt-0.5">
                  <strong>Cause:</strong> Browser security policy blocks requests from <code>http://127.0.0.1:5500</code> to <code>http://localhost:8080</code>.<br/>
                  <strong>Solution:</strong> Ensure <code>@CrossOrigin(origins = "*")</code> is on <code>StudentController</code> or add <code>CorsConfig.java</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: DEMO CHECKLIST */}
        {activeSection === 'checklist' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Final Project Demonstration Checklist</h3>
              <p className="text-slate-600">
                Make sure each item is verified before presenting to professors or evaluators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'MySQL Service Running', desc: 'MySQL server status active on port 3306 with database created.' },
                { title: 'Spring Boot Console Green', desc: 'Backend starts cleanly without stack traces on port 8080.' },
                { title: 'Create Operation (POST)', desc: 'Submit new student and verify automatic insertion in MySQL.' },
                { title: 'Read All Operation (GET)', desc: 'Dashboard and table dynamically populate with active database records.' },
                { title: 'Read One Operation (GET)', desc: 'Clicking View opens modal with complete student profile information.' },
                { title: 'Update Operation (PUT)', desc: 'Editing phone/year persists to MySQL and refreshes the UI.' },
                { title: 'Delete Operation (DELETE)', desc: 'Confirmation modal prevents accidental deletion and removes record.' },
                { title: 'Duplicate Roll Number Check', desc: 'Attempting duplicate roll number returns 409 Conflict with alert.' },
                { title: 'Search Filter Functional', desc: 'Typing name or roll number instantly filters visible table rows.' },
                { title: 'Postman Collection Ready', desc: 'Pre-saved requests for all 5 CRUD operations with sample bodies.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">{item.title}</strong>
                    <span className="text-slate-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
