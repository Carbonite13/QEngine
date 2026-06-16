let rowStore = [];
let editingEmployeeId = null;

const API_URL = "http://127.0.0.1:3000/api/employees";

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

    // employeeId is server-generated
    if (id === "employeeId") {
        $field.removeClass("is-invalid").addClass("is-valid");
        return true;
    }

    if (!value) {
        isValid = false;
        message = "This field is required.";
    } else {

        if (id === "ssn" && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
            isValid = false;
            message = "SSN must follow the 000-00-0000 format.";
        }
        else if (id === "phone" && !/^\d{10}$/.test(value)) {
            isValid = false;
            message = "Phone number must be exactly 10 digits.";
        }
        else if (id === "salary" && (isNaN(value) || Number(value) < 1)) {
            isValid = false;
            message = "Salary must be a positive number greater than 0.";
        }
        else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = "Please enter a valid email address.";
        }
    }

    if (isValid) {
        $field.removeClass("is-invalid").addClass("is-valid");

        if ($errorField.length) {
            $errorField.text("");
        }
    } else {
        $field.removeClass("is-valid").addClass("is-invalid");

        if ($errorField.length) {
            $errorField.text(message);
        }
    }

    return isValid;
}

async function loadEmployees() {
    try {
        rowStore = await $.ajax({
            url: API_URL,
            method: "GET"
        }).fail(function(xhr, status, error){
            console.log("xhr:", xhr);
            console.log("status:", status);
            console.log("error:", error);
            console.log("response:", xhr.responseText);
        });;

        renderTableRows();
    } catch (err) {
        console.error(err);
        alert("Failed to load employee records.");
    }
}

function showForm() {

    $modal.addClass("show")
        .css("display", "block");

    $("body").addClass("modal-open");
}

function hideForm() {

    $modal.removeClass("show")
        .css("display", "none");

    $("body").removeClass("modal-open");

    $form[0].reset();

    $form.find("input, select, textarea")
        .removeClass("is-invalid is-valid");

    $form.find(".invalid-feedback")
        .text("");

    editingEmployeeId = null;
}

function populateForm(data) {

    $.each(data, function (key, value) {

        const $field = $(`#${key}`);

        if ($field.length) {
            $field.val(value);
        }
    });
}

async function handleFormSubmit() {

    let isFormValid = true;

    $form.find("input, select, textarea").each(function () {

        if (!validateError($(this))) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        return;
    }

    const formData = Object.fromEntries(new FormData($form[0]));

    try {

        if (editingEmployeeId !== null) {

            await $.ajax({
                url: `${API_URL}/${editingEmployeeId}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(formData)
            }).fail(function(xhr, status, error){
                console.log("xhr:", xhr);
                console.log("status:", status);
                console.log("error:", error);
                console.log("response:", xhr.responseText);
            });;

        } else {

            await $.ajax({
                url: API_URL,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData)
            }).fail(function(xhr, status, error){
                console.log("xhr:", xhr);
                console.log("status:", status);
                console.log("error:", error);
                console.log("response:", xhr.responseText);
            });
        }

        hideForm();

        await loadEmployees();

    } catch (err) {

        console.error(err);

        alert("Failed to save employee.");
    }
}

function renderTableRows() {

    $tbody.empty();

    $.each(rowStore, function (_, employee) {

        const $tr = $("<tr>");

        const values = [

            employee.employeeId,
            employee.name,
            employee.dob,
            employee.ssn,
            employee.gender,
            employee.address,
            employee.phone,
            employee.email,
            employee.preferredCommunication,
            employee.jobTitle,
            employee.department,
            employee.salary
        ];

        $.each(values, function (i, val) {

            const $td = $("<td>")
                .text(val ?? "");

            if (i === 0) {
                $td.addClass("ps-3");
            }

            $tr.append($td);
        });

        const $actionsTd = $("<td>")
            .addClass("pe-3 text-end text-nowrap");

        const $editBtn = $("<button>")
            .text("Edit")
            .addClass("btn btn-sm btn-warning me-1")
            .on("click", () =>
                handleEditAction(employee)
            );

        const $deleteBtn = $("<button>")
            .text("Delete")
            .addClass("btn btn-sm btn-danger")
            .on("click", () =>
                handleDeleteAction(employee.employeeId)
            );

        $actionsTd.append(
            $editBtn,
            $deleteBtn
        );

        $tr.append($actionsTd);

        $tbody.append($tr);
    });
}

function handleEditAction(employee) {

    editingEmployeeId = employee.employeeId;
    $submitBtn.text("Update Record");

    $("#modalTitle").text("Update Employee Records");
    populateForm(employee);

    $("#employeeId").prop("readonly", true);

    showForm();
}

async function handleDeleteAction(id) {
    const confirmed = confirm(
        `Are you sure you want to completely remove Employee ID: ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await $.ajax({
            url: `${API_URL}/${id}`,
            method: "DELETE"
        }).fail(function(xhr, status, error){
            console.log("xhr:", xhr);
            console.log("status:",status);
            console.log("error:", error);
            console.log("response:", xhr.responseText);
        });;

        await loadEmployees();
    } catch (err) {
        console.error(err.status);
        alert("Failed to delete employee.");
    }
}

$(document).ready(async function () {

    $modal = $("#employeeModal");
    $form = $("#employeeForm");
    $tbody = $("#employeeTbody");
    $submitBtn = $("#submitBtn");

    $("#addBtn").on("click", () => {

        editingEmployeeId = null;

        $submitBtn.text(
            "Save Record"
        );

        $("#modalTitle")
            .text(
                "Add New Employee"
            );

        $form[0].reset();

        $("#employeeId")
            .val("")
            .prop("readonly", true);

        showForm();
    });

    $("#cancelBtn, #closeHeaderBtn")
        .on("click", hideForm);

    $form.on(
        "submit",
        async function (e) {

            e.preventDefault();

            await handleFormSubmit();
        }
    );

    $form.on(
        "input",
        "input, select, textarea",
        function () {

            validateError($(this));
        }
    );

    await loadEmployees();
});