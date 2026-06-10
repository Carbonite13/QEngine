// State management
let rowStore = [];
let editingEmployeeId = null;

// jQuery DOM Caching (Prefixing variables with $ is a common jQuery convention)
let $modal, $form, $tbody, $submitBtn;

// Optimised Employee Factory Function using object spread
function createEmployee(data) {
    return { ...data };
}

/**
 * Validates a single input and dynamically coordinates Bootstrap validation state classes.
 * @param {jQuery} $field - The jQuery object of the input field
 * @returns {boolean}
 */
function validateError($field) {
    let isValid = true;
    let message = "";

    const value = $field.val().trim();
    const id = $field.attr("id");
    const $errorField = $(`#${id}Error`);

    if (!value) {
        isValid = false;
        message = "This field is required.";
    } else {
        if (id === "employeeId" && !/^[A-Za-z0-9-]+$/.test(value)) {
            isValid = false; message = "Employee ID must contain only alphanumeric characters or hyphens.";
        } else if (id === "ssn" && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
            isValid = false; message = "SSN must follow the 000-00-0000 format.";
        } else if (id === "phone" && !/^\d{10}$/.test(value)) {
            isValid = false; message = "Phone number must be exactly 10 digits.";
        } else if (id === "salary" && (isNaN(value) || Number(value) < 1)) {
            isValid = false; message = "Salary must be a positive number greater than 0.";
        } else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false; message = "Please enter a valid email address.";
        }
    }

    if (isValid) {
        $field.removeClass("is-invalid").addClass("is-valid");
        if ($errorField.length) $errorField.text("");
    } else {
        $field.removeClass("is-valid").addClass("is-invalid");
        if ($errorField.length) $errorField.text(message);
    }

    return isValid;
}

function showForm() {
    $modal.addClass("show").css("display", "block");
    $("body").addClass("modal-open");
}

function hideForm() {
    $modal.removeClass("show").css("display", "none");
    $("body").removeClass("modal-open");
    $form[0].reset(); // Access raw DOM element to trigger native reset

    // Wipe Bootstrap validation states
    $form.find("input, select, textarea").removeClass("is-invalid is-valid");
    $form.find(".invalid-feedback").text("");
}

function populateForm(data) {
    $.each(data, function (key, value) {
        $(`#${key}`).val(value);
    });
}

function handleFormSubmit() {
    let isFormValid = true;

    // Validate all fields
    $form.find("input, select, textarea").each(function () {
        if (!validateError($(this))) {
            isFormValid = false;
        }
    });

    if (!isFormValid) return;

    // Extract form data into a clean object using modern JS combined with jQuery
    const formData = Object.fromEntries(new FormData($form[0]));

    if (editingEmployeeId !== null) {
        const targetEmployee = rowStore.find(emp => emp.employeeId === editingEmployeeId);
        if (targetEmployee) {
            Object.assign(targetEmployee, formData);
        }
        editingEmployeeId = null;
    } else {
        const duplicateCheck = rowStore.some(emp => emp.employeeId === formData.employeeId);
        if (duplicateCheck) {
            $("#employeeId").addClass("is-invalid");
            $("#employeeIdError").text("An employee with this ID already exists!");
            return;
        }

        rowStore.push(createEmployee(formData));
    }

    hideForm();
    renderTableRows();
}

function renderTableRows() {
    $tbody.empty(); // jQuery shorthand to wipe inner HTML

    $.each(rowStore, function (index, employee) {
        const $tr = $("<tr>");

        const values = [
            employee.employeeId, employee.name, employee.dob, employee.ssn,
            employee.gender, employee.address, employee.phone,
            employee.email, employee.preferredCommunication, employee.jobTitle,
            employee.department, employee.salary
        ];

        // Map values into <td> elements
        $.each(values, function (i, val) {
            const $td = $("<td>").text(val);
            if (i === 0) $td.addClass("ps-3"); // Bootstrap padding for first column
            $tr.append($td);
        });

        // Action Buttons using jQuery chaining
        const $actionsTd = $("<td>").addClass("pe-3 text-end text-nowrap");

        const $editBtn = $("<button>")
            .text("Edit")
            .addClass("btn btn-sm btn-warning me-1")
            .on("click", () => handleEditAction(employee));

        const $deleteBtn = $("<button>")
            .text("Delete")
            .addClass("btn btn-sm btn-danger")
            .on("click", () => handleDeleteAction(employee.employeeId));

        $actionsTd.append($editBtn, $deleteBtn);
        $tr.append($actionsTd).appendTo($tbody);
    });
}

function handleEditAction(employee) {
    editingEmployeeId = employee.employeeId;
    $submitBtn.text("Update Record");
    $("#modalTitle").text("Update Employee Records");

    populateForm(employee);
    showForm();
}

function handleDeleteAction(id) {
    if (confirm(`Are you sure you want to completely remove Employee ID: ${id}?`)) {
        rowStore = rowStore.filter(emp => emp.employeeId !== id);
        renderTableRows();
    }
}

// Initializer using jQuery document ready
$(document).ready(function () {
    $modal = $("#employeeModal");
    $form = $("#employeeForm");
    $tbody = $("#employeeTbody");
    $submitBtn = $("#submitBtn");

    $("#addBtn").on("click", () => {
        editingEmployeeId = null;
        $submitBtn.text("Save Record");
        $("#modalTitle").text("Add New Employee");
        showForm();
    });

    $("#cancelBtn, #closeHeaderBtn").on("click", hideForm);

    $form.on("submit", function (e) {
        e.preventDefault();
        handleFormSubmit();
    });

    // Event delegation: Listen for input on any field inside the form
    $form.on("input", "input, select, textarea", function () {
        validateError($(this));
    });
});