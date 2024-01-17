const inquire = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
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
    inquire 
        .prompt(question)
        .then((answers) => {
            if (answers.business === 'View all employees') {
                console.log('Viewing all employees');
                db.query(`SELECT (*) FROM employee`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
                askQuestion();
            } else if (answers.business === 'Add Employee') {
                console.log('Adding Employee');

                askQuestion();
            } else if (answers.business === 'Update Employee Role') {
                console.log('Updating Employee Role');

                askQuestion();
            } else if (answers.business === 'View all roles') {
                console.log('Viewing all roles');

                askQuestion();
            } else if (answers.business === 'Add Role') {
                console.log('Adding Role');

                askQuestion();
            } else if (answers.business === 'View all departments') {
                console.log('Viewing all departments');

                askQuestion();
            } else if (answers.business === 'Add Department') {
                console.log('Adding Department');

                askQuestion();
            } else if (answers.business === 'Quit') {
                console.log('Bye-bye');
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

askQuestion();