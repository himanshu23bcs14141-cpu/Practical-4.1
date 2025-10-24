// employeeManagement.js

const readline = require('readline');

// Initialize array to store employees
let employees = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n=== Employee Management System ===");
    console.log("1. Add Employee");
    console.log("2. List All Employees");
    console.log("3. Remove Employee by ID");
    console.log("4. Exit");
    rl.question("Enter your choice: ", handleMenu);
}

function handleMenu(choice) {
    switch (choice.trim()) {
        case '1':
            addEmployee();
            break;
        case '2':
            listEmployees();
            break;
        case '3':
            removeEmployee();
            break;
        case '4':
            console.log("Exiting program...");
            rl.close();
            break;
        default:
            console.log("Invalid choice! Please enter a number between 1-4.");
            showMenu();
    }
}

function addEmployee() {
    rl.question("Enter Employee ID: ", (id) => {
        if (employees.some(emp => emp.id === id.trim())) {
            console.log("Employee ID already exists. Try again.");
            return showMenu();
        }
        rl.question("Enter Employee Name: ", (name) => {
            employees.push({ id: id.trim(), name: name.trim() });
            console.log("Employee added successfully!");
            showMenu();
        });
    });
}

function listEmployees() {
    if (employees.length === 0) {
        console.log("No employees found.");
    } else {
        console.log("\nEmployee List:");
        employees.forEach(emp => console.log(`ID: ${emp.id}, Name: ${emp.name}`));
    }
    showMenu();
}

function removeEmployee() {
    rl.question("Enter Employee ID to remove: ", (id) => {
        const index = employees.findIndex(emp => emp.id === id.trim());
        if (index !== -1) {
            employees.splice(index, 1);
            console.log("Employee removed successfully!");
        } else {
            console.log("Employee not found!");
        }
        showMenu();
    });
}

// Start the CLI
showMenu();
