// State management
let rowStore = [];
let editingEmployeeId = null;

// DOM Element References
let addBtn, modal, form, tbody, submitBtn, cancelBtn, closeHeaderBtn;

// Optimised Employee Factory Function using object spread
function createEmployee(data) {
    return { ...data };
}

/**
 * Validates a single input and dynamically coordinates Bootstrap validation state classes.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field 
 * @returns {boolean} Whether the field passes validation structural constraints
 */
function validateError(field) {
    let isValid = true;
    let message = "";

    const value = field.value.trim();
    const errorFieldID = field.id.concat("Error");
    const errorField = document.getElementById(errorFieldID);

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

    // Toggle Bootstrap validation classes along with custom error copy
    if (isValid) {
        field.classList.remove("is-invalid");
        field.classList.add("is-invalid-not", "is-valid"); // Optional aesthetic enhancement
        if (errorField) errorField.innerText = "";
    } else {
        field.classList.remove("is-valid");
        field.classList.add("is-invalid");
        if (errorField) errorField.innerText = message;
    }

    return isValid;
}

function showForm() {
    // Graceful interaction routing natively via programmatic configuration
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
}

function hideForm() {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
    form.reset();

    // Wipe contextual Bootstrap error indicators when wiping state elements
    form.querySelectorAll("input, select, textarea").forEach(field => {
        field.classList.remove("is-invalid", "is-valid");
    });
    form.querySelectorAll("span[id$='Error'], div[id$='Error']").forEach(div => {
        div.innerText = "";
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

    fields.forEach(field => {
        if (!validateError(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        return;
    }

    const formData = getFormData();

    if (editingEmployeeId !== null) {
        const targetEmployee = rowStore.find(emp => emp.employeeId === editingEmployeeId);
        if (targetEmployee) {
            Object.assign(targetEmployee, formData);
        }
        editingEmployeeId = null;
    } else {
        const duplicateCheck = rowStore.some(emp => emp.employeeId === formData.employeeId);
        if (duplicateCheck) {
            const idInput = document.getElementById("employeeId");
            const idError = document.getElementById("employeeIdError");
            if (idInput) idInput.classList.add("is-invalid");
            if (idError) idError.innerText = "An employee with this ID already exists!";
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

        // Add padding helper to the first metric block matching table header layout
        values.forEach((val, index) => {
            const td = document.createElement("td");
            td.textContent = val;
            if (index === 0) td.classList.add("ps-3");
            tr.appendChild(td);
        });

        const actionsTd = document.createElement("td");
        actionsTd.className = "pe-3 text-end text-nowrap";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "btn btn-sm btn-warning me-1";
        editBtn.addEventListener("click", () => handleEditAction(employee));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn btn-sm btn-danger";
        deleteBtn.addEventListener("click", () => handleDeleteAction(employee.employeeId));

        actionsTd.append(editBtn, deleteBtn);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

function handleEditAction(employee) {
    editingEmployeeId = employee.employeeId;
    submitBtn.textContent = "Update Record";
    document.getElementById("modalTitle").textContent = "Update Employee Records";

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
    submitBtn = document.getElementById("submitBtn");
    cancelBtn = document.getElementById("cancelBtn");
    closeHeaderBtn = document.getElementById("closeHeaderBtn");

    addBtn.addEventListener("click", () => {
        editingEmployeeId = null;
        submitBtn.textContent = "Save Record";
        document.getElementById("modalTitle").textContent = "Add New Employee";
        showForm();
    });

    cancelBtn.addEventListener("click", hideForm);
    closeHeaderBtn.addEventListener("click", hideForm);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
        input.addEventListener("input", () => validateError(input));
    });
}

document.addEventListener("DOMContentLoaded", init);