// State management
let rowStore = [];
let editingEmployeeId = null;

// DOM Element References
let addBtn, modal, form, tbody, submitBtn, cancelBtn;

// Optimised Employee Factory Function using object spread
function createEmployee(data) {
    return { ...data };
}

// Client-side JS custom validation routines
function validateField(field) {
    let isValid = true;
    let message = "";
    const value = field.value.trim();

    if (!value) {
        isValid = false;
        message = "This field is required.";
    } else {
        if (field.id === "employeeId" && !/^[A-Za-z0-9-]+$/.test(value)) {
            isValid = false;
            message = "Employee ID must contain only alphanumeric characters or hyphens.";
        } else if (field.id === "ssn" && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
            isValid = false;
            message = "SSN must follow the 000-00-0000 format.";
        } else if (field.id === "phone" && !/^\d{10}$/.test(value)) {
            isValid = false;
            message = "Phone number must be exactly 10 digits.";
        } else if (field.id === "salary" && (isNaN(value) || Number(value) < 1)) {
            isValid = false;
            message = "Salary must be a positive number greater than 0.";
        } else if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = "Please enter a valid email address.";
        }
    }

    field.setCustomValidity(message);
    return isValid;
}

function showForm() {
    modal.style.display = "flex";
}

function hideForm() {
    modal.style.display = "none";
    form.reset();

    // Clear validation diagnostics upon close
    form.querySelectorAll("input, select, textarea").forEach(field => {
        field.setCustomValidity("");
    });
}

function populateForm(data) {
    Object.entries(data).forEach(([key, value]) => {
        const field = form.elements[key];
        if (field) field.value = value;
    });
}

function getFormData() {
    return Object.fromEntries(new FormData(form));
}

function handleFormSubmit() {
    const fields = form.querySelectorAll("input, select, textarea");
    let isFormValid = true;

    // Direct explicit evaluation of form fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        form.reportValidity();
        return;
    }

    const formData = getFormData();

    if (editingEmployeeId !== null) {
        const targetEmployee = rowStore.find(emp => emp.employeeId === editingEmployeeId);
        if (targetEmployee) {
            // Merges data cleanly because property keys now match form keys exactly
            Object.assign(targetEmployee, formData);
        }
        editingEmployeeId = null;
    } else {
        const duplicateCheck = rowStore.some(emp => emp.employeeId === formData.employeeId);
        if (duplicateCheck) {
            alert("An employee with this ID already exists!");
            return;
        }

        const newEmployee = createEmployee(formData);
        rowStore.push(newEmployee);
    }

    hideForm();
    renderTableRows();
}

function renderTableRows() {
    tbody.innerHTML = "";

    rowStore.forEach(employee => {
        const tr = document.createElement("tr");

        const values = [
            employee.employeeId, employee.name, employee.dob, employee.ssn,
            employee.gender, employee.address, employee.phone,
            employee.email, employee.preferredCommunication, employee.jobTitle,
            employee.department, employee.salary
        ];

        values.forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });

        const actionsTd = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-action-btn";
        editBtn.addEventListener("click", () => handleEditAction(employee));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-action-btn";
        deleteBtn.addEventListener("click", () => handleDeleteAction(employee.employeeId));

        actionsTd.append(editBtn, deleteBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

function handleEditAction(employee) {
    editingEmployeeId = employee.employeeId;
    submitBtn.textContent = "Update";

    // Because the fields perfectly match the internal data structure, we pass it right in
    populateForm(employee);
    showForm();
}

function handleDeleteAction(id) {
    if (confirm(`Are you sure you want to completely remove Employee ID: ${id}?`)) {
        rowStore = rowStore.filter(emp => emp.employeeId !== id);
        renderTableRows();
    }
}

function init() {
    addBtn = document.getElementById("addBtn");
    modal = document.getElementById("employeeModal");
    form = document.getElementById("employeeForm");
    tbody = document.getElementById("employeeTbody");
    submitBtn = form.querySelector("button[type='submit']");
    cancelBtn = document.getElementById("cancelBtn");

    addBtn.addEventListener("click", () => {
        editingEmployeeId = null;
        submitBtn.textContent = "Save";
        showForm();
    });

    cancelBtn.addEventListener("click", hideForm);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // Handle real-time inline evaluation using JS inputs
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
        input.addEventListener("input", () => validateField(input));
    });
}

document.addEventListener("DOMContentLoaded", init);