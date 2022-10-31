INSERT INTO departments (name) VALUES
 ("Engineering"),
 ("Finance"),
 ("Sales"),
 ("Legal");


INSERT INTO roles (title, salary, department_id) VALUES 
("Sales Lead", 10000, 3),
("Salesperson", 80000, 3),
("Lead Engineer", 150000, 1),
("Software Engineer", 120000, 1),
("Account Manager", 160000, 2),
("Accountant", 125000, 2),
("Lead Legal Team", 25000, 4),
("Lawyer", 19000, 4);



INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES
("Historia", "Reiss", NULL, 1),
("Armin", "Arlert", 1, 2),
("Levi", "Ackerman", NULL, 3),
("Eren","Yeager",3, 4),
("Kenny", "Ackerman",NULL, 5),
("Grisha", "Yeage", 5, 6),
("Traute", "Carven", NULL, 7),
("Sasha", "Blouse", 7, 8),
("Mikasa","Ackerman",3,4);
 
 
 
 
 
 
 

--  
-- SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id left join employees e on employees.manager_id = e.id;