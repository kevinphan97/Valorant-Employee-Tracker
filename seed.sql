USE employees_db;

INSERT INTO role (title, salary, department_id)
VALUES
("Support", 75000, 1),
("In-Game Leader", 80000, 1),
("Entry", 100000, 3),
("Recon", 85000, 4),
("Crowd Controller", 95000, 4),
("Manager", 125000, 2);

INSERT INTO department (department_name)
VALUES
("Sentinels"),
("Controllers"),
("Duelist"),
("Initiators");

INSERT INTO employee (alias_used, origin_country, role_id, manager_id)
VALUES
("Cypher", "Morocco", 2, NULL),
("Sage", "China", 1, NULL),
("Killjoy", "Germany", 2, NULL),
("Astra", "Ghana", 6, 1),
("Brimstone", "United States", 6, 2),
("Omen", "Unknown Origin", 6, 3),
("Viper", "United States", 6, 4),
("Jett", "Korea", 3, NULL),
("Phoenix", "United Kingdom", 3, NULL),
("Raze", "Brazil", 3, NULL),
("Reyna", "Mexico", 3, NULL),
("Yoru", "Japan", 3, NULL),
("Sova", "Russia", 4, NULL),
("Skye", "Australia", 4, NULL),
("Breach", "Sweden", 5, NULL),
("Kay/O", "Unknown Origin", 5, NULL),
("Killjoy", "Germany", 2, NULL);