const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("mysql-promise");

const connectionFunc = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Amazing654!",
    database: "employees_db"
};

const connection = mysql.createConnection(connectionFunc);

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
                "Update employee role",
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
                case "Update employee role":
                    updateRole();
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
    let employeeRole = [];
    let employees = [];

    promisemysql.createConnection(connectionFunc)
    .then((dbconnection) => {
        return Promise.all([
            dbconnection.query("SELECT * FROM employee_role"),
            dbconnection.query("SELECT employee.id, concat(employee.alias_used, ' ', employee.origin_country) AS fullAlias FROM employee")
        ]);
    })

    .then(([role, name]) => {
        for (var i = 0; i < role.length; i++){
            employeeRole.push(role[i].title);
        }
        for (var i = 0; i < name.length; i++) {
            employees.push(name[i].fullAlias)
        }
        return Promise.all([role, name]);
    })

    inquirer.prompt([
        {
            name: "aliasUsed",
            type: "input",
            message: "What is the employee's alias?"
        },

        {
            name: "originCountry",
            type: "input",
            message: "Where is the employee originated from?"
        },

        {
            name: "employeeRole",
            type: "list",
            message: "What is the employee's role?",
            choices: employeeRole
        },

        {
            name: "employeeManager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: employees
        }
    ])

    .then(answers => {
        let roleId;

        let managerId;

        for (var i = 0; i < role.length; i++) {
            if (answers.employeeRole === role[i].title) {
                roleId = role[i].id;
            }
        }

        for (var i = 0; i < name.length; i++) {
            if (answers.employeeManager === name[i].fullAlias) {
                managerId = name[i].id;
            }
        }

        connection.query("INSERT INTO employee SET?", 
        {
            alias_used: answers.aliasUsed,
            origin_country: answers.originCountry,
            role_id: roleId,
            manager_id: managerId
        });
        console.log("Your new employee has been added!")
        start();
    })
    .catch(err => {
        console.log(err);
        start();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department you want to add?"
        }
    ])
    
    .then(answers => {
        connection.query("INSERT INTO department SET ?",
        {
            department_name: answers.departmentName,
        });
        console.log("Your new department has been added successfully!")
        start();
    })
    .catch(err => {
        console.log(err);
        start();
    });
};
    
function addRole() {
    let departmentName = [];

    promisemysql.createConnection(connectionFunc)
    .then((dbconnection) =>{
        return Promise.all([
            dbconnection.query("SELECT * FROM department"),
        ]);
    })

    .then (([department]) => {
        for (var i = 0; i < department.length; i++) {
            departmentName.push(department[i].department_name);
        }

        return Promise.all([department]);
    })

    .then (([department]) => {
        inquirer.prompt([
            {
                name: "roleName",
                type: "input",
                message: "What is the new role that you would like to add?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary for this new role?"
            },
            {
                name: "roleDepartment",
                type: "list",
                message: "What department does this role belong to?"
            }
        ])

        .then(answers => {
            let departmentId;

            for (var i = 0; i < department.length; i++) {
                if (answers.roleDepartment === department[i].department_name) {
                    departmentId = department[i].id;
                }
            }

            connection.query("INSERT INTO employee_role SET?", 
                {
                    title: answers.roleName,
                    salary: answers.roleSalary,
                    department_id: departmentId
            });

            console.log("Your new role has been added!");
            start();
        })
    })
    .catch(err => {
        console.log(err);
        start();
    });
};

function updateRole() {
    let employeeRole = [];
    let employees = [];

    promisemysql.createConnection(connectionFunc)
    .then((dbconnection) => {
        return Promise.all([
            dbconnection.query("SELECT * FROM employee_role"),
            dbconnection.query("SELECT employee.id, concat(employee.alias_used, ' ', employee.origin_country) AS fullAlias FROM employee")
        ]);
    })

    .then(([role,name]) => {
        for (var i = 0; i < role.length; i++){
            employeeRole.push(role[i].title);
        }
        for (var i = 0; i < name.length; i++) {
            employees.push(name[i].fullAlias)
        }
        return Promise.all([role,name]);
    })

    .then(([role, name]) =>{
        inquierer.prompt([
            {
                name: "employeeAlias",
                type: "list",
                message: "Which employee would you like to select?"
            },
            {
                name: "newRole",
                type: "list",
                message: "What role would you like to change the employee to?"
            }
        ])

        .then (answers => {
            let roleId;
            let employeeId;

            for (var i = 0; i < role.length; i++){
                if (answers.newRole === role[i].title) {
                    roleId = role[i].id;
                }
            }

            for (var i = 0; i < role.length; i++){
                if (answers.employeeAlias === name[i].fullAlias) {
                    employeeId = name[i].id;
                }
            }

            connection.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`);

            console.log("This employee's role has been changed!");
            start();
        });
    })
    .catch(err => {
        console.log(err);
        start();
    })
};