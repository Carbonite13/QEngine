# QEngine
A minimalist, high-performance single-page application (SPA) designed to handle the complete CRUD (Create, Read, Update, Delete) lifecycle of organizational workforce records.

## 1. Functionality Documentation
The EIMS is designed to streamline the management of personnel records within an organization.

### Core Features
* **Centralized Record Management**: Users can add, view, update, and delete employee records from a unified interface.
* **Modal Data Entry**: An interactive modal form handles all inputs, ensuring a clean workspace.
* **Data Persistence (Session-based)**: Records are maintained in the application state and displayed in a structured data grid.
* **Form Validation**: Enforces data integrity by requiring inputs for all fields and applying patterns to specific data (e.g., SSN, Phone, Salary).

### User Workflow
1.  **Creation**: Click "Add New Employee" to open the input modal, fill in required fields, and save the record.
2.  **Display**: Records appear instantly in the data table below the control button.
3.  **Modification**: Click "Edit" on any row to open the modal populated with existing data. Submit updates to reflect changes in the table.
4.  **Deletion**: Click "Delete" to remove a record from the organizational list after confirmation.

---

## 2. Implementational Documentation
The system uses a lightweight HTML-first layout with a minimal JavaScript controller for behavior and dynamic table rendering.

### Architecture Overview
The application is split across three files with clear responsibilities:

* **`index.html`**: Declares the static UI — the add button, employee modal form (all fields, validation attributes, and action buttons), and the table header skeleton.
* **`css/style.css`**: Styles the layout, modal overlay, form grid, table, and action buttons.
* **`js/app.js`**: Contains a `createEmployee` factory for plain employee objects, and an `App` controller that wires events, manages state, and renders dynamic table rows.

### Implementation Details
* **Data Model**: `createEmployee()` returns a plain object with employee attributes. Updates use `Object.assign()` on the stored reference.
* **State Management**: The `App` controller maintains a `rowStore` array of employee objects and tracks `editingEmployeeId` for add vs. edit context.
* **Event Handling**: A centralized `handleFormSubmit` method determines whether to create a new employee or update an existing one based on `editingEmployeeId`.
* **DOM Structure**:
    * **Static markup**: Form fields, selects, table headers, and the modal shell live in `index.html` and are referenced by ID in JavaScript.
    * **Dynamic markup**: Table body rows and per-row Edit/Delete buttons are generated in `renderTableRows()` as data changes.
    * **Modal Logic**: The `App` controller toggles `display: flex` / `none` on the modal element and resets the form on close.

### Configuration & Patterns
* **Validation**: Field requirements (`required`, `pattern`, `min`) are declared directly on HTML form elements, allowing the browser to handle client-side validation natively.
* **Style Coupling**: CSS targets semantic selectors (`.modal`, `form`, `.add-btn`, `table`) that match the static HTML structure, using CSS Grid for the form layout and Flexbox for the application container.

### Technical Stack
* **Language**: Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Methodology**: HTML-first markup with a minimal JavaScript controller; plain objects for data.
* **State Handling**: Memory-resident data storage.
