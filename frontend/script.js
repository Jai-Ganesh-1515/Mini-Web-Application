/**
 * Student Management System - Frontend REST API Client
 * Connects directly to Spring Boot backend at http://localhost:8080/api/students
 */

const API_BASE_URL = 'http://localhost:8080/api/students';

// Global cached state
let studentsList = [];
let deleteTargetId = null;

// Bootstrap Modal Instances
let studentModal;
let viewModal;
let deleteModal;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap Modals
    studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
    viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Event Listeners
    document.getElementById('studentForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        renderStudentTable(studentsList);
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);

    // Initial Fetch
    fetchAllStudents();
});

// ==========================================
// 1. READ: FETCH ALL STUDENTS (GET)
// ==========================================
async function fetchAllStudents() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to retrieve students from server');
        studentsList = await response.json();
        renderStudentTable(studentsList);
        updateDashboardMetrics(studentsList);
    } catch (error) {
        console.error('Error fetching students:', error);
        showAlert('danger', 'Backend connection error. Ensure Spring Boot is running on port 8080.');
        document.getElementById('studentTableBody').innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-circle-fill me-1"></i> Failed to connect to Spring Boot backend.
                </td>
            </tr>`;
    }
}

// ==========================================
// 2. RENDER TABLE & METRICS
// ==========================================
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (!students || students.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');

    students.forEach((student) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-4 text-muted fw-semibold">#${student.id}</td>
            <td><span class="badge bg-light text-dark border font-monospace px-2 py-1">${escapeHtml(student.rollNumber)}</span></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-initials">${escapeHtml(student.name.charAt(0))}</div>
                    <span class="fw-semibold text-dark">${escapeHtml(student.name)}</span>
                </div>
            </td>
            <td><a href="mailto:${escapeHtml(student.email)}" class="text-decoration-none">${escapeHtml(student.email)}</a></td>
            <td class="font-monospace">${escapeHtml(student.phone)}</td>
            <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle badge-dept">${escapeHtml(student.department)}</span></td>
            <td><small class="text-secondary">${escapeHtml(student.year)} &bull; Sec ${escapeHtml(student.section)}</small></td>
            <td class="text-end pe-4">
                <button class="btn btn-outline-info action-btn me-1" title="View Profile" onclick="viewStudentDetails(${student.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-warning action-btn me-1" title="Edit Student" onclick="openEditStudentModal(${student.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger action-btn" title="Delete Student" onclick="openDeleteModal(${student.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateDashboardMetrics(students) {
    const totalCount = Array.isArray(students) ? students.length : 0;
    const uniqueDepts = new Set((students || []).map((s) => s.department).filter(Boolean));
    const uniqueYears = new Set((students || []).map((s) => s.year).filter(Boolean));
    const uniqueSections = new Set((students || []).map((s) => s.section).filter(Boolean));

    const totalEl = document.getElementById('metricTotalStudents');
    if (totalEl) totalEl.innerText = totalCount;

    const deptEl = document.getElementById('metricDepartments');
    if (deptEl) deptEl.innerText = uniqueDepts.size;

    const yearEl = document.getElementById('metricYears');
    if (yearEl) yearEl.innerText = uniqueYears.size;

    const secEl = document.getElementById('metricSections');
    if (secEl) secEl.innerText = uniqueSections.size;
}

// ==========================================
// 3. CREATE & UPDATE (POST / PUT)
// ==========================================
async function handleFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('studentId').value;
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const department = document.getElementById('department').value;
    const year = document.getElementById('year').value;
    const section = document.getElementById('section').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const address = document.getElementById('address').value.trim();

    // Client-side basic validation
    if (!rollNumber || !name || !email || !phone || !department || !year || !section || !dateOfBirth) {
        showAlert('warning', 'Please fill in all mandatory fields.');
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showAlert('warning', 'Phone number must be exactly 10 digits.');
        return;
    }

    const payload = {
        rollNumber,
        name,
        email,
        phone,
        department,
        year,
        section,
        dateOfBirth,
        address
    };

    const isEdit = Boolean(id);
    const url = isEdit ? `${API_BASE_URL}/${id}` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.status === 409) {
            showAlert('danger', `Roll Number ${rollNumber} is already registered to another student.`);
            return;
        }

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Server returned an error');
        }

        studentModal.hide();
        showAlert('success', isEdit ? 'Student updated successfully!' : 'Student registered successfully!');
        fetchAllStudents();
    } catch (error) {
        console.error('Error saving student:', error);
        showAlert('danger', error.message || 'Failed to save student.');
    }
}

// ==========================================
// 4. READ SINGLE: VIEW DETAILS (GET by ID)
// ==========================================
async function viewStudentDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Student record not found');
        const student = await response.json();

        const container = document.getElementById('viewModalBody');
        container.innerHTML = `
            <div class="avatar-initials mx-auto mb-3" style="width: 70px; height: 70px; font-size: 1.8rem; background: #2563eb; color: #ffffff;">
                ${escapeHtml(student.name.charAt(0))}
            </div>
            <h4 class="fw-bold mb-1">${escapeHtml(student.name)}</h4>
            <span class="badge bg-light text-secondary border px-3 py-1 mb-3 font-monospace">${escapeHtml(student.rollNumber)}</span>
            
            <div class="text-start bg-light p-3 rounded-3 mt-3">
                <p class="mb-2"><strong>Email:</strong> <a href="mailto:${escapeHtml(student.email)}">${escapeHtml(student.email)}</a></p>
                <p class="mb-2"><strong>Phone:</strong> ${escapeHtml(student.phone)}</p>
                <p class="mb-2"><strong>Department:</strong> ${escapeHtml(student.department)}</p>
                <p class="mb-2"><strong>Cohort:</strong> ${escapeHtml(student.year)} &bull; Section ${escapeHtml(student.section)}</p>
                <p class="mb-2"><strong>Date of Birth:</strong> ${escapeHtml(student.dateOfBirth)}</p>
                <p class="mb-0"><strong>Address:</strong> ${escapeHtml(student.address || 'Not Provided')}</p>
            </div>
        `;
        viewModal.show();
    } catch (error) {
        showAlert('danger', 'Unable to fetch student details.');
    }
}

// ==========================================
// 5. EDIT MODAL PREPARATION
// ==========================================
function openAddStudentModal() {
    document.getElementById('studentModalLabel').innerText = 'Add New Student';
    document.getElementById('submitBtn').innerText = 'Save Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

async function openEditStudentModal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Could not retrieve student details');
        const student = await response.json();

        document.getElementById('studentModalLabel').innerText = 'Edit Student Details';
        document.getElementById('submitBtn').innerText = 'Update Student';
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

        studentModal.show();
    } catch (error) {
        showAlert('danger', 'Failed to load student for editing.');
    }
}

// ==========================================
// 6. DELETE STUDENT (DELETE)
// ==========================================
function openDeleteModal(id) {
    deleteTargetId = id;
    const student = studentsList.find((s) => s.id === id);
    const infoBox = document.getElementById('deleteStudentInfo');
    if (student) {
        infoBox.innerHTML = `<strong>${escapeHtml(student.name)}</strong> (${escapeHtml(student.rollNumber)}) &bull; ${escapeHtml(student.department)}`;
    } else {
        infoBox.innerHTML = `Student ID: #${id}`;
    }
    deleteModal.show();
}

async function executeDelete() {
    if (!deleteTargetId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${deleteTargetId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete student');

        deleteModal.hide();
        showAlert('success', 'Student deleted successfully.');
        fetchAllStudents();
    } catch (error) {
        console.error('Delete error:', error);
        showAlert('danger', 'Unable to delete student.');
    } finally {
        deleteTargetId = null;
    }
}

// ==========================================
// 7. SEARCH FILTER
// ==========================================
function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    if (!query) {
        renderStudentTable(studentsList);
        return;
    }

    const filtered = studentsList.filter((s) => 
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query)
    );
    renderStudentTable(filtered);
}

// ==========================================
// 8. TOAST NOTIFICATIONS
// ==========================================
function showAlert(type, message) {
    const container = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
    alertEl.id = alertId;
    alertEl.role = 'alert';
    alertEl.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alertEl);

    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) {
            const bsAlert = new bootstrap.Alert(el);
            bsAlert.close();
        }
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
