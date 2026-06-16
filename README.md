# QEngine - Employee Information Management System

A high-performance Employee Information Management System (EIMS) built with a modern full-stack architecture.

## 1. Functionality Documentation
The EIMS is designed to streamline the management of personnel records within an organization.

### Core Features
* **Centralized Record Management**: Users can add, view, update, and delete employee records from a unified interface.
* **Modal Data Entry**: An interactive modal form handles all inputs, ensuring a clean workspace.
* **Data Persistence**: Records are stored in a MySQL database via a Sequelize ORM.
* **Form Validation**: Enforces data integrity on both client (jQuery/Bootstrap) and server (Sequelize) levels.

### User Workflow
1.  **Creation**: Click "Add New Employee". The system automatically generates a unique Employee ID (EIMS-timestamp).
2.  **Display**: Records are fetched from the `/api/employees` endpoint and rendered dynamically.
3.  **Modification**: Click "Edit" to update employee details.
4.  **Deletion**: Click "Delete" to permanently remove a record after confirmation.

---

## 2. Technical Documentation

### Architecture Overview
The application follows a standard client-server model:

* **Backend**: Node.js with Express.js.
* **ORM**: Sequelize for database interactions.
* **Database**: MySQL.
* **Frontend**: jQuery for AJAX/DOM and Bootstrap 5 for UI/UX.

### Implementation Details
* **API Endpoints**:
    * `GET /api/employees`: Fetch all records.
    * `POST /api/employees`: Create a new record. Server generates `employeeId` if missing.
    * `PUT /api/employees/:id`: Update a record by `employeeId`.
    * `DELETE /api/employees/:id`: Delete a record by `employeeId`.
* **Error Handling**: All API routes return JSON responses, including 404 and 500 errors.
* **Configuration**: Environment variables (`.env`) manage database credentials and server port.

### Technical Stack
* **Runtime**: Node.js
* **Backend**: Express, Sequelize, MySQL2
* **Frontend**: jQuery 3.7.1, Bootstrap 5.3.3
* **Environment**: Dotenv for configuration

## 3. Setup Instructions
1.  Install dependencies: `npm install`
2.  Configure `.env` file with your MySQL credentials.
3.  Start the server: `node server/app.js`
4.  Access the UI at `http://localhost:3000`
