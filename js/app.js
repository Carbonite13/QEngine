class Employee {
    constructor(name, dob, ssn, gender, address, phone, email, com, id, title, dept, salary) {
        this.name = name;
        this.dob = dob;
        this.ssn = ssn;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.com = com;
        this.title = title;
        this.id = id;
        this.dept = dept;
        this.salary = salary;
    }

    // logging
    display() {
        console.info(this.data());
    }

    // return the data to repopulate and display (edit/add/display)
    data() {
        return {
            name: this.name,
            dob: this.dob,
            ssn: this.ssn,
            gender: this.gender,
            address: this.address,
            phone: this.phone,
            email: this.email,
            com: this.com,
            id: this.id,
            title: this.title,
            dept: this.dept,
            salary: this.salary,
        }
    }

    // update the data (doesnt return)
    update(data) {
        Object.assign(this, data);
    }

    getId() {
        return this.id;
    }
}

class Table {
    constructor() {
        // create a table and handle all the operations in it
        this.table = document.createElement("table");
        this.thead = document.createElement("thead");
        this.tbody = document.createElement("tbody");

        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);

        // store rows as Employee instances
        this.rowStore = [];
    }

    setHeaders(headers) {
        this.thead.innerHTML = "";
        const row = document.createElement("tr");

        headers.forEach(
            header => {
                const th = document.createElement("th");
                th.textContent = header;

                row.appendChild(th);
            }
        );

        this.thead.appendChild(row);
    }

    // internal function
    addRow(data) {
        const row = document.createElement("tr");
        data.forEach(
            value => {
                const td = document.createElement("td");
                td.textContent = value;

                row.appendChild(td);
            }
        );

        this.tbody.appendChild(row);
    }
}

class Form {
    constructor(parent) {
        this.modal = document.createElement("div");
        this.modal.className = "modal";
        this.modal.style.display = "none";

        this.form = document.createElement("form");

        // Enhanced fields with built-in patterns for required validations
        this.fields = [
            { type: "text", id: "employeeId", placeholder: "Employee ID", required: true, pattern: "^[A-Za-z0-9-]+$" },
            { type: "text", id: "name", placeholder: "Name", required: true },
            { type: "date", id: "dob", required: true },
            { type: "text", id: "ssn", placeholder: "SSN (e.g., 000-00-0000)", required: true, pattern: "^\\d{3}-\\d{2}-\\d{4}$" },
            { type: "select", id: "gender", required: true, options: ["", "Male", "Female", "Other"] },
            { type: "textarea", id: "address", placeholder: "Address", required: true },
            { type: "tel", id: "phone", placeholder: "Phone (10-digit)", required: true, pattern: "^\\d{10}$" },
            { type: "email", id: "email", placeholder: "Email", required: true },
            { type: "select", id: "preferredCommunication", required: true, options: ["", "Email", "Phone"] },
            { type: "text", id: "jobTitle", placeholder: "Job Title", required: true },
            { type: "select", id: "department", required: true, options: ["", "Sales", "Marketing", "Human Resources", "Finance", "Engineering", "Information Technology (IT)", "Customer Support", "Design"] },
            { type: "number", id: "salary", placeholder: "Salary", required: true, min: "1" }
        ];

        this.build();

        this.modal.appendChild(this.form);
        parent.appendChild(this.modal);
    }

    build() {
        this.fields.forEach(field => {
            let element;

            if (field.type === "select") {
                element = document.createElement("select");
                field.options.forEach(option => {
                    const opt = document.createElement("option");
                    opt.value = option;
                    opt.textContent = option || `Select ${field.id}`;
                    element.appendChild(opt);
                });
            } else if (field.type === "textarea") {
                element = document.createElement("textarea");
            } else {
                element = document.createElement("input");
                element.type = field.type;
            }

            element.id = field.id;
            element.name = field.id;

            if (field.placeholder)
                element.placeholder = field.placeholder;

            if (field.required)
                element.required = true;

            // Apply advanced pattern/min validation attributes seamlessly to the elements
            if (field.pattern)
                element.pattern = field.pattern;
            if (field.min)
                element.min = field.min;

            this.form.appendChild(element);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Save";

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancel";

        // reset the form and hide the modal
        cancel.addEventListener(
            "click",
            () => {
                this.hide();
            }
        );

        this.form.append(
            submit,
            cancel
        );
    }

    show() {
        this.modal.style.display = "flex";
    }

    hide() {
        this.modal.style.display = "none";
        this.form.reset();
    }

    populate(data) {
        Object.entries(data)
            .forEach(([key, value]) => {
                const field = this.form.elements[key];
                if (field)
                    field.value = value;
            });
    }

    getData() {
        return Object.fromEntries(
            new FormData(this.form)
        );
    }
}

// App control
class App {
    constructor() {
        this.container = document.getElementById("app") || document.body;

        // 1. Create and render the "Add New" button
        this.addBtn = document.createElement("button");
        this.addBtn.textContent = "Add New Employee";
        this.addBtn.className = "add-btn";
        this.container.appendChild(this.addBtn);

        // 2. Setup structural layout components
        this.formManager = new Form(this.container);
        this.tableManager = new Table();
        this.container.appendChild(this.tableManager.table);

        // Track state context for adding vs editing
        this.editingEmployeeId = null;

        this.init();
    }

    init() {
        // Set up descriptive structured header matching assignments
        this.tableManager.setHeaders([
            "ID", "Name", "DOB", "SSN", "Gender", "Address",
            "Phone", "Email", "Preferred Comms", "Job Title", "Department", "Salary", "Actions"
        ]);

        // Event: "Add New" configuration context activation
        this.addBtn.addEventListener("click", () => {
            this.editingEmployeeId = null;
            const submitBtn = this.formManager.form.querySelector("button[type='submit']");
            if (submitBtn) submitBtn.textContent = "Save";
            this.formManager.show();
        });

        // Event: Intercept valid form submission an processing
        this.formManager.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    handleFormSubmit() {
        const formData = this.formManager.getData();

        if (this.editingEmployeeId !== null) {
            // Edit flow operation context
            const targetEmployee = this.tableManager.rowStore.find(emp => emp.getId() === this.editingEmployeeId);
            if (targetEmployee) {
                targetEmployee.update({
                    id: formData.employeeId,
                    name: formData.name,
                    dob: formData.dob,
                    ssn: formData.ssn,
                    gender: formData.gender,
                    address: formData.address,
                    phone: formData.phone,
                    email: formData.email,
                    com: formData.preferredCommunication,
                    title: formData.jobTitle,
                    dept: formData.department,
                    salary: formData.salary
                });
            }
            this.editingEmployeeId = null;
        } else {
            // Check if Employee ID already exists to avoid structural conflicts
            const duplicateCheck = this.tableManager.rowStore.some(emp => emp.getId() === formData.employeeId);
            if (duplicateCheck) {
                alert("An employee with this ID already exists!");
                return;
            }

            // Create new Employee record mapping constructor sequence correctly
            const newEmployee = new Employee(
                formData.name,
                formData.dob,
                formData.ssn,
                formData.gender,
                formData.address,
                formData.phone,
                formData.email,
                formData.preferredCommunication,
                formData.employeeId,
                formData.jobTitle,
                formData.department,
                formData.salary
            );
            this.tableManager.rowStore.push(newEmployee);
        }

        this.formManager.hide();
        this.renderTableRows();
    }

    renderTableRows() {
        // Clear old DOM representation rows out
        this.tableManager.tbody.innerHTML = "";

        // Iterate over updated rowStore records array layout
        this.tableManager.rowStore.forEach(employee => {
            const rowData = employee.data();
            const tr = document.createElement("tr");

            // Explicit chronological display map for cells
            const values = [
                rowData.id, rowData.name, rowData.dob, rowData.ssn,
                rowData.gender, rowData.address, rowData.phone,
                rowData.email, rowData.com, rowData.title, rowData.dept, rowData.salary
            ];

            values.forEach(val => {
                const td = document.createElement("td");
                td.textContent = val;
                tr.appendChild(td);
            });

            // Context Action Interactive Buttons
            const actionsTd = document.createElement("td");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-action-btn";
            editBtn.addEventListener("click", () => this.handleEditAction(employee));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-action-btn";
            deleteBtn.addEventListener("click", () => this.handleDeleteAction(employee.getId()));

            actionsTd.append(editBtn, deleteBtn);
            tr.appendChild(actionsTd);

            this.tableManager.tbody.appendChild(tr);
        });
    }

    handleEditAction(employee) {
        this.editingEmployeeId = employee.getId();

        // Translate specific internal Employee variables to matching Form field IDs
        const formRepopulationMap = {
            employeeId: employee.id,
            name: employee.name,
            dob: employee.dob,
            ssn: employee.ssn,
            gender: employee.gender,
            address: employee.address,
            phone: employee.phone,
            email: employee.email,
            preferredCommunication: employee.com,
            jobTitle: employee.title,
            department: employee.dept,
            salary: employee.salary
        };

        // Alter Modal Action Text context dynamically to "Update" per requirements
        const submitBtn = this.formManager.form.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Update";

        this.formManager.populate(formRepopulationMap);
        this.formManager.show();
    }

    handleDeleteAction(id) {
        if (confirm(`Are you sure you want to completely remove Empyee ID: ${id}?`)) {
            this.tableManager.rowStore = this.tableManager.rowStore.filter(emp => emp.getId() !== id);
            this.renderTableRows();
        }
    }
}

// Instantiate App initialization on pageload
document.addEventListener("DOMContentLoaded", () => {
    new App();
});