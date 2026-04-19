CREATE DATABASE IF NOT EXISTS MyDB;
USE MyDB;

CREATE TABLE IF NOT EXISTS MyTable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(100) NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    Age INT NOT NULL
);

INSERT INTO MyTable (FirstName, Surname, Age) VALUES
('Kamil', 'Suchy', 23),
('Anna', 'Nowak', 30),
('Piotr', 'Kowalski', 28),
('Ewa', 'Wiśniewska', 35);
