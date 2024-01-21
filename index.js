const inquire = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '850607Gb',
        database: 'business_db',
        port: 3306
    }
);

const question = [
    {
        type: 'list',
        name: 'business',
        message: 'What would you like to do?',
        choices: ['View all employees', 'Add Employee', 'Update Employee Role', 'View all roles', 'Add Role', 'View all departments', 'Add Department', 'Quit'],
        default: 'View all employees'
    }
]

function askQuestion() {
    inquire.prompt(question).then(answers => {
        if (answers.business === 'View all employees') {
            console.log('Viewing all employees');
            viewAllEmployees();
        } else if (answers.business === 'Add Employee') {
            console.log('Adding Employee');
            addEmployee();
        } else if (answers.business === 'Update Employee Role') {
            console.log('Updating Employee Role');
            updateEmployee();
        } else if (answers.business === 'View all roles') {
            console.log('Viewing all roles');
            viewAllRoles();
        } else if (answers.business === 'Add Role') {
            console.log('Adding Role');
            addRole();
        } else if (answers.business === 'View all departments') {
            console.log('Viewing all departments');
            viewAllDepartments();
        } else if (answers.business === 'Add Department') {
            console.log('Adding Department');
            addDepartment();
        } else if (answers.business === 'Quit') {
            console.log('Bye-bye. Press CTRL+C');
            return;
        };
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log('Prompt could not be rendered in current environment');
        } else {
            console.log('Something went wrong');
        }
    })
}

function viewAllEmployees() {
    db.query(
        "SELECT * FROM employee",

        function(err, res) {
            if(err) {
                console.log(err);
            } else {
                console.table(res);
                askQuestion();
            }
        }
    );
}


async function updateEmployee() {
    const employeeData = await db.promise().query('SELECT * FROM employee;');
    console.log("Employee's data", employeeData[0]);
    const employees = employeeData[0].map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    })); 


    inquire.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee role do you want to update?",
            choices: employees
        }
    ]).then(employeeToUpdate => {
        console.log(employeeToUpdate);
        const selectedEmployeeId = employeeToUpdate.employeeId;

        inquire.prompt([
            {
                type: 'list',
                name: 'newRoleId',
                message: 'Which role do you want to assign the selected employee?',
                choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead']
            }
        ]).then(async newRoleSelection => {
            console.log(newRoleSelection);
            const newRoleId = await getRoleIdByName(newRoleSelection.newRoleId);
            db.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [newRoleId, selectedEmployeeId],
                function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Employee role updated successfully!");
                        askQuestion();
                    }
                }
            );
        });
    });
}

// Function to get role ID by role name
async function getRoleIdByName(roleName) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id FROM role WHERE role_title = ?',
            [roleName],
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (results.length === 0) {
                        reject(new Error(`Role '${roleName}' not found.`));
                    } else {
                        resolve(results[0].id);
                    }
                }
            }
        );
    });
}

function addEmployee() {inquire.prompt( [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'What is the employee`s first name?'

    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'What is the employee`s last name?'
    },
    {
        type: 'input',
        name: 'roles',
        message: 'What is the ID of the employee`s role?',
    },
    {
        type: 'input',
        name: 'managers',
        message: 'What is the ID of the employee`s manager?',
    }
]).then(response =>{
    const firstName = response.employeeFirstName;
    const lastName = response.employeeLastName;
    const roleId = response.roles;
    const managerId = response.managers;

    db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [firstName, lastName, roleId, managerId],
        function (err, res) {
            if(err) {
                console.log(err);
            } else {
                console.log('Employee added successfully!');
                askQuestion();
            }
        }
    );

});

}


function viewAllRoles() {
    db.query('SELECT * FROM role', function(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.table(res);
            askQuestion();
        }
    })
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.table(res);
            askQuestion();
        }
    })
}


function addDepartment() {
    inquire.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        },
    ]).then(response => {
        const departmentName = response.departmentName;

        db.query('INSERT INTO department (department_name) VALUES (?)',
        [departmentName],
        function (err, res) {
            if(err) {
                console.log(err);
            } else {
                console.log('Department added successfully!');
                askQuestion();
            }
            }
        );
    });
}

function addRole() {
    inquire.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'What is the ID of the department that the role belongs to?'
        }
    ]).then(response => {
        const title = response.roleTitle;
        const salary = response.roleSalary;
        const departmentId = response.roleDepartment;

        db.query(
            'INSERT INTO role (role_title, salary, department_id) VALUES(?, ?, ?)', [title, salary, departmentId],

            function(err, res) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Role add successfully!');
                    askQuestion();
                }
            }
        );
    });
}

askQuestion();