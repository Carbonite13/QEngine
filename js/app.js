let rowStore = [];
let editingEmployeeId = null;

// Auto-increment Sequence Configuration
const idSlug = 'EMP';
let idNumber = 0;

function getId(n) {
    return `${idSlug}-${String(n).padStart(3, '0')}`;
}

let $modal, $form, $tbody, $submitBtn;

/**
 * Validates a single input and dynamically coordinates Bootstrap validation state classes.
 */
function validateError($field) {
    let isValid = true;
    let message = "";

    const value = $field.val().trim();
    const id = $field.attr("id");
    const $errorField = $(`#${id}Error`);

    // Skip validation for employeeId since it's now auto-generated and read-only
    if (id === "employeeId") {
        $field.removeClass("is-invalid").addClass("is-valid");
        return true;
    }

    if (!value) {
        isValid = false;
        message = "This field is required.";
    } else {
        if (id === "ssn" && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
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
    $form[0].reset();

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

    // Extract form data (Read-only values are safely captured here)
    const formData = Object.fromEntries(new FormData($form[0]));

    if (editingEmployeeId !== null) {
        // Mode: Update Existing Record
        const targetEmployee = rowStore.find(emp => emp.employeeId === editingEmployeeId);
        if (targetEmployee) {
            Object.assign(targetEmployee, formData);
        }
        editingEmployeeId = null;
    } else {
        // Mode: New Record Insertion Success
        rowStore.push({ ...formData });

        // Advance sequence by one since the insertion was successful
        idNumber++;
    }

    hideForm();
    renderTableRows();
}

function renderTableRows() {
    $tbody.empty();

    $.each(rowStore, function (index, employee) {
        const $tr = $("<tr>");

        const values = [
            employee.employeeId, employee.name, employee.dob, employee.ssn,
            employee.gender, employee.address, employee.phone,
            employee.email, employee.preferredCommunication, employee.jobTitle,
            employee.department, employee.salary
        ];

        $.each(values, function (i, val) {
            const $td = $("<td>").text(val);
            if (i === 0) $td.addClass("ps-3");
            $tr.append($td);
        });

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
    // Keep the Employee ID field disabled/readonly during editing updates
    $("#employeeId").prop("readonly", true);
    showForm();
}

function handleDeleteAction(id) {
    if (confirm(`Are you sure you want to completely remove Employee ID: ${id}?`)) {
        rowStore = rowStore.filter(emp => emp.employeeId !== id);
        renderTableRows();
    }
}

$(document).ready(function () {
    $modal = $("#employeeModal");
    $form = $("#employeeForm");
    $tbody = $("#employeeTbody");
    $submitBtn = $("#submitBtn");

    $("#addBtn").on("click", () => {
        editingEmployeeId = null;
        $submitBtn.text("Save Record");
        $("#modalTitle").text("Add New Employee");

        // 1. Calculate and populate the next sequential ID automatically
        // 2. Apply readonly protection state
        $("#employeeId")
            .val(getId(idNumber + 1))
            .prop("readonly", true);

        showForm();
    });

    // If cancelled, hideForm executes form.reset() leaving the global idNumber completely unchanged
    $("#cancelBtn, #closeHeaderBtn").on("click", hideForm);

    $form.on("submit", function (e) {
        e.preventDefault();
        handleFormSubmit();
    });

    $form.on("input", "input, select, textarea", function () {
        validateError($(this));
    });
});