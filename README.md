# QEngine
A minimalist, high-performance single-page application (SPA) designed to handle the complete CRUD (Create, Read, Update, Delete) lifecycle of organizational workforce records.

## 1. Functionality Documentation
The EIMS is designed to streamline the management of personnel records within an organization.

### Core Features
* **Centralized Record Management**: Users can add, view, update, and delete employee records from a unified interface.
* **Dynamic Data Entry**: An interactive modal form handles all inputs, ensuring a clean workspace.
* **Data Persistence (Session-based)**: Records are maintained in the application state and displayed in a structured data grid.
* **Form Validation**: Enforces data integrity by requiring inputs for all fields and applying patterns to specific data (e.g., SSN, Phone, Salary).

### User Workflow
1.  **Creation**: Click "Add New Employee" to open the input modal, fill in required fields, and save the record.
2.  **Display**: Records appear instantly in the data table below the control button.
3.  **Modification**: Click "Edit" on any row to open the modal populated with existing data. Submit updates to reflect changes in the table.
4.  **Deletion**: Click "Delete" to remove a record from the organizational list after confirmation.

---

## 2. Implementational Documentation
The system utilizes a modular, Object-Oriented Programming (OOP) approach in JavaScript to ensure maintainability and scalability.

### Architecture Overview
The application is structured into four primary JavaScript classes:

* **`Employee` Class**: Acts as the data model. It stores employee attributes and provides helper methods for updating and retrieving structured data.
* **`Table` Class**: Manages the DOM representation of the data. It handles the creation of the table structure and the rendering of row items.
* **`Form` Class**: Manages the input modal. It dynamically generates form elements based on an internal field configuration array and handles data extraction and resetting.
* **`App` Controller**: The orchestrator. It ties the components together, manages application state (e.g., `rowStore`), and handles user events like form submission, editing, and deletion.

### Implementation Details
* **State Management**: The application stores all employee instances in a private `rowStore` array within the `Table` class (or accessible via the `App` controller).
* **Event Handling**: The system uses a centralized `handleFormSubmit` method that determines whether to create a new `Employee` instance or update an existing one based on the presence of an `editingEmployeeId`.
* **DOM Manipulation**:
    * **Modal Logic**: The `Form` class uses `display: flex` and `none` to toggle visibility, utilizing CSS `backdrop-filter` for a modern UI.
    * **Table Rendering**: The `renderTableRows()` function clears the `tbody` and re-injects rows on every state change to ensure the view stays in sync with the data.

### Configuration & Patterns
* **Validation**: The `Form` class defines field requirements (e.g., `pattern`, `required`, `min`) which are mapped directly to HTML5 input attributes, allowing the browser to handle client-side validation natively.
* **Style Coupling**: The frontend is built with a separate `style.css` file utilizing CSS Grid for the form layout and Flexbox for the application container, ensuring a responsive design across device sizes.

### Technical Stack
* **Language**: Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Methodology**: Object-Oriented Programming (OOP).
* **State Handling**: Memory-resident data storage.
