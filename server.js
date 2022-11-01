// /======== Dependencies===================//
const inquirer = require("inquirer")
const mysql = require("mysql2")
// const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "tracker_db"
  });


//========== Connection ID ==========================//
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});
//================== Initial Prompt =======================//
function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All employees?", 
              "View All employees's By roles?",
              "View all Emplyees By Deparments", 
              "Update employees",
              "Add employees?",
              "Add roles?",
              "Add departments?"
            ]
    }
]).then(function(val) {
        switch (val.choice) {
            case "View All employees?":
              viewAllemployees();
            break;
    
          case "View All employees's By roles?":
              viewAllroles();
            break;
          case "View all Emplyees By Deparments":
              viewAlldepartments();
            break;
          
          case "Add employees?":
                addemployees();
              break;

          case "Update employees":
                updateemployees();
              break;
      
            case "Add roles?":
                addroles();
              break;
      
            case "Add departments?":
                adddepartments();
              break;
    
            }
    })
}
//============= View All employees ==========================//
function viewAllemployees() {
    connection.query("SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id left join employees e on employees.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}
//============= View All roles ==========================//
function viewAllroles() {
  connection.query("SELECT employees.first_name, employees.last_name, roles.title AS Title FROM employees JOIN roles ON employees.role_id = roles.id;", 
  function(err, res) {
  if (err) throw err
  console.table(res)
  startPrompt()
  })
}
//============= View All employees By departments ==========================//
function viewAlldepartments() {
  connection.query("SELECT employees.first_name, employees.last_name, departments.name AS departments FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
  })
}

//================= Select roles Quieries roles Title for Add employees Prompt ===========//
var rolesArr = [];
function selectroles() {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }

  })
  return rolesArr;
}
//================= Select roles Quieries The Managers for Add employees Prompt ===========//
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}
//============= Add employees ==========================//
function addemployees() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "roles",
          type: "list",
          message: "What is their roles? ",
          choices: selectroles()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var rolesId = selectroles().indexOf(val.roles) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employees SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: rolesId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}
//============= Update employees ==========================//
  function updateemployees() {
    connection.query("SELECT employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;", function(err, res) {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the employees's last name? ",
          },
          {
            name: "roles",
            type: "rawlist",
            message: "What is the employees new title? ",
            choices: selectroles()
          },
      ]).then(function(val) {
        var rolesId = selectroles().indexOf(val.roles) + 1
        connection.query("UPDATE employees SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: rolesId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            startPrompt()
        })
  
    });
  });

  }
//============= Add employees roles ==========================//
function addroles() { 
  connection.query("SELECT roles.title AS Title, roles.salary AS Salary FROM roles",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO roles SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )

    });
  });
  }
//============= Add departments ==========================//
function adddepartments() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What departments would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO departments SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}