const mysql = require('mysql');
const inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "luna",
    database: "employee_trackerDB"
  });

  connection.connect(err =>{
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
      promptMessages();
  });

  function promptMessages() {
      inquirer.prompt({
          name: "action",
          type: "list",
          message: "What would you like to do?",
          choices: [
              "View all departments",
              "View all roles",
              "View all employees",
              "Add a department",
              "Add a role",
              "Add an employee",
              "Update employee role",
              "Exit"
          ]
      })
      .then(function(answer) {
          if (answer.action === "View all departments") {
              viewDepartments();
          }
          else if (answer.action === "View all roles") {
              viewRoles();
          }
          else if (answer.action === "View all employees") {
              viewEmployees();
          }
          else if (answer.action === "Add a department") {
              addDepartment();
          }
          else if (answer.action === "Add a role") {
              addRole();
          }
          else if (answer.action === "Add an employee") {
            addEmployee();
          }
          else if (answer.action === "Update employee role") {
            updateRole();
          }
          else if (answer.action === "Exit") {
              connection.end();
          }
      })
  }

function viewDepartments(){
  var query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(`DEPARTMENTS:`)
    res.forEach(department => {
        console.log(`ID: ${department.id} | Name: ${department.name}`)
    })
    promptMessages();
    });
};

function viewRoles(){
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(`ROLES:`)
      res.forEach(role => {
          console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`)
      })
      promptMessages();
      });
  };

  function viewEmployees(){
    var query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(`EMPLOYEES:`)
      res.forEach(employee => {
          console.log(`ID: ${employee.id} | First Name: ${ employee.first_name} | Last Name: ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`)
      })
      promptMessages();
      });
  };

  // Add department
  function addDepartment(){
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the name of the new department?"
    })
    .then (answer =>{
    let query = "INSERT INTO department (name) VALUES ( ? )";
    connection.query(query, answer.department, function(err, res) {
        if (err) throw err;
        console.log(err);
        console.log(`You have added the department: ${(answer.department).toUpperCase()}.`)
    })
    viewDepartments();
    })
  };


  // Add a Role
    function addRole(){
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What is the name of the new role?"
    },
    {
        name: "salary",
        type: "inpue",
        message: "What is the salary?"
    },
    {
        name: "departmentName",
        type: "list",
        message: "Which department would this role classify as?",
        choices:
        [
            "Marketing",
            "Operations",
            "Finance",
            "Human Resources"
        ]
    }
])
    .then (function(answer){
        let q = "SELECT * FROM department WHERE ?" ;
        console.log(q)

        connection.query(q,{name: answer.departmentName},  function(err, res) {
            console.log("Department ID: "+JSON.stringify(res));
            var id = res[0].id;
            console.log("Dept Id: "+id);

          let q_role = connection.query("SELECT * FROM department" + "INSERT INTO role (title, salary, department_id) VALUES ( ? )",
                {
                    title: answer.title,
                    salary: parseInt(answer.salary),
                    department_id: id
                },
                function(err, res_role){
                for (var i = 0; i < res.length; i++) {
                console.log("Role query: "+q_role);
                if(err){
                    console.log(err)
                }
            }
                console.log(res_role);
            })
        })
        viewRoles()
        });


// Add new employee
function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });
  }


// Update employee role
function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated..')
            prompt();
        });
    });
  }
}