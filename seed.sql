USE employee_trackerDB;

INSERT INTO department (name)
VALUES 
	("Marketing"),
    ("Operations"),
    ("Finance"),
    ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES 
	("Media Manager", 65.000, 1),
    ("Media Specialist", 49.000, 1),
    ("General Manager", 120.000, 2),
    ("Coach", 53.000, 2),
    ("Accountant", 77.000, 3),
    ("Budget Analyst", 74.000, 3),
    ("HR Generalist", 67.000, 4),
    ("HR Manager", 110.000, 4);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
	("Jack", "Nicholson", 4, NULL),
    ("Leonardo", "DiCaprio", 3, 3),
    ("Denzel", "Washington", 5, NULL),
    ("Will", "Smith", 8, 1),
    ("Michael", "Jordan", 1, NULL),
    ("Keanu", "Reeves", 7, 5);