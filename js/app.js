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

    display() {
        console.info(this.data());
    }

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
        };
    }

    update(data) {
        Object.assign(this, data);
    }

    getId() {
        return this.id;
    }
}

class App {
    constructor() {
        this.addBtn = document.getElementById("add-btn");
        this.modal = document.getElementById("employee-modal");
        this.form = document.getElementById("employee-form");
        this.tbody = document.getElementById("employee-tbody");
        this.submitBtn = this.form.querySelector("button[type='submit']");
        this.cancelBtn = document.getElementById("cancel-btn");

        this.rowStore = [];
        this.editingEmployeeId = null;

        this.init();
    }

    init() {
        this.addBtn.addEventListener("click", () => {
            this.editingEmployeeId = null;
            this.submitBtn.textContent = "Save";
            this.showForm();
        });

        this.cancelBtn.addEventListener("click", () => this.hideForm());

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    showForm() {
        this.modal.style.display = "flex";
    }

    hideForm() {
        this.modal.style.display = "none";
        this.form.reset();
    }

    populateForm(data) {
        Object.entries(data).forEach(([key, value]) => {
            const field = this.form.elements[key];
            if (field) field.value = value;
        });
    }

    getFormData() {
        return Object.fromEntries(new FormData(this.form));
    }

    handleFormSubmit() {
        const formData = this.getFormData();

        if (this.editingEmployeeId !== null) {
            const targetEmployee = this.rowStore.find(emp => emp.getId() === this.editingEmployeeId);
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
            const duplicateCheck = this.rowStore.some(emp => emp.getId() === formData.employeeId);
            if (duplicateCheck) {
                alert("An employee with this ID already exists!");
                return;
            }

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
            this.rowStore.push(newEmployee);
        }

        this.hideForm();
        this.renderTableRows();
    }

    renderTableRows() {
        this.tbody.innerHTML = "";

        this.rowStore.forEach(employee => {
            const rowData = employee.data();
            const tr = document.createElement("tr");

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

            this.tbody.appendChild(tr);
        });
    }

    handleEditAction(employee) {
        this.editingEmployeeId = employee.getId();
        this.submitBtn.textContent = "Update";

        this.populateForm({
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
        });

        this.showForm();
    }

    handleDeleteAction(id) {
        if (confirm(`Are you sure you want to completely remove Empyee ID: ${id}?`)) {
            this.rowStore = this.rowStore.filter(emp => emp.getId() !== id);
            this.renderTableRows();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new App();
});
