CREATE DATABASE IF NOT EXISTS zadanie_php1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zadanie_php1;

CREATE TABLE IF NOT EXISTS osoby (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imie VARCHAR(100) NOT NULL,
  nazwisko VARCHAR(100) NOT NULL
);

INSERT INTO osoby (imie, nazwisko) VALUES
  ('Kamil', 'Suchy'),
  ('Anna', 'Nowak'),
  ('Piotr', 'Kowalski'),
  ('Ewa', 'Wójcik');
