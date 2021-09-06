const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("mysql-promise");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Amazing654!",
    database: "employees_db"
});

connection.connect(function(err){
    if (err) throw (err);
    start();
});

console.table (
    "\n---------- Valorant Employees ----------\n"
);

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "This is the Valorant employee database, what option would you like to choose?",
            choices: [
                "View all valorant employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Delete an employee",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch(answer.action) {
                case "View all valorant employees":
                    viewEmployees();
                    break;
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            };
        });
};
function viewEmployees() {
    let query = "Select * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw (err);
        let employeeArray = [];
        res.forEach(employee => employeeArray.push(employee));
        console.table(employeeArray);
        start();
    });
};

function viewDepartments() {
    let query = "Select * FROM department";
    connection.query(query, function(err, res) {
        if (err) throw (err);
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table(departmentArray);
        start();
    });
};

function viewRoles() {
    let query = "Select * FROM role";
    connection.query(query, function(err, res) {
        if (err) throw (err);
        let roleArray = [];
        res.forEach(role => roleArray.push(role));
        console.table(roleArray);
        start();
    });
};

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "aliasUsed",
                type: "input",
                message: "What is the employee's alias?",
            },
            {
                name: "originCountry",
                type: "input",
                message: "What is the employee's country of origin?",
            },
            {
                name: "employeeRole",
                type: "input",
                message: "What is this employee's role ID?",
            },
            {
                name: "employeeManager",
                type: "input",
                message: "What is this employee's manager ID?",
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    alias_used: answer.aliasUsed,
                    origin_country: answer.originCountry,
                    role_id: answer.employeeRole,
                    manager_id: answer.employeeManager,
                },
                function (err, res) {
                    if (err) throw err;
                    start();
                }
            );
        });
}
function addDepartment() {
    inquirer.prompt([
        {    
            name: "departmentName",
            type: "input",
            message: "What is the department name?",
        }
    ])
        .then((answer) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    department_name: answer.departmentName,
                },
                function (err, res) {
                    if (err) throw err;
                    start();
                }
            );
        });
}
    
function addRole() {
    inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the name of the role?",
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is this roles salary?",
            },
            {
                name: "departmentId",
                type: "input",
                message: "What is this role's department ID?",
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO role SET ?`,
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.departmentId,
                },
                function (err, res) {
                    if (err) throw err;
                    start();
                }
            );
        });
}