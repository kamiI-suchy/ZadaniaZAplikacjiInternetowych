# Wytłumaczenie kodu – Zadanie PHP 1 (PHP + MySQL)

Zadanie polega na stworzeniu tabeli w MySQL, wypełnieniu jej rekordami i wyświetleniu
wybranego rekordu w przeglądarce za pomocą skryptu PHP, który przyjmuje `id` z URL.

---

## Plik: `setup.sql`

```sql
CREATE DATABASE IF NOT EXISTS MyDB;
-- Tworzy bazę danych o nazwie MyDB.
-- IF NOT EXISTS – polecenie nie zgłosi błędu, jeśli baza już istnieje.

USE MyDB;
-- Wybiera bazę MyDB jako aktywną – wszystkie kolejne polecenia działają na tej bazie.

CREATE TABLE IF NOT EXISTS MyTable (
-- Tworzy tabelę MyTable (jeśli jeszcze nie istnieje).
-- Tabela przechowuje rekordy osób.

    id        INT AUTO_INCREMENT PRIMARY KEY,
    -- id – klucz główny: unikalny identyfikator każdego rekordu.
    -- AUTO_INCREMENT – MySQL automatycznie nadaje kolejne numery (1, 2, 3...) przy INSERT.
    -- PRIMARY KEY  – wartość id jest unikalna i nie może być NULL.

    Added     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Added – data i godzina dodania rekordu.
    -- NOT NULL              – pole jest wymagane.
    -- DEFAULT CURRENT_TIMESTAMP – jeśli nie podamy wartości, MySQL wstawi aktualny czas.

    FirstName VARCHAR(100) NOT NULL,
    -- Imię osoby; VARCHAR(100) – ciąg znaków o max. długości 100.

    Surname   VARCHAR(100) NOT NULL,
    -- Nazwisko osoby.

    Age       INT NOT NULL
    -- Wiek osoby; INT – liczba całkowita.
);

INSERT INTO MyTable (FirstName, Surname, Age) VALUES
-- Wstawia 4 rekordy do tabeli (kolumny id i Added uzupełniają się automatycznie).

('Kamil',  'Suchy',      23),  -- Rekord 1 – autor zadania
('Anna',   'Nowak',      30),  -- Rekord 2
('Piotr',  'Kowalski',   28),  -- Rekord 3
('Ewa',    'Wiśniewska', 35);  -- Rekord 4
```

---

## Plik: `index.php`

```php
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <?php
    // Blok PHP – wszystko między <?php a ?> jest kodem serwerowym; przeglądarka widzi tylko wynik.

    if (!filter_has_var(INPUT_GET, 'id')) {
        // filter_has_var(INPUT_GET, 'id') – sprawdza czy w URL istnieje parametr ?id=...
        // INPUT_GET odpowiada tablicy $_GET (parametry z URL)
        echo ('Missing id'); // Wysyła komunikat błędu do przeglądarki
        exit(1);             // Kończy wykonanie skryptu z kodem błędu 1
    }

    $aID = filter_var($_REQUEST['id'], FILTER_SANITIZE_NUMBER_INT);
    // $_REQUEST['id'] – pobiera wartość parametru id z URL (np. "1", " 5 ", "abc123")
    // FILTER_SANITIZE_NUMBER_INT – usuwa wszystkie znaki oprócz cyfr i znaków +/-
    // Chroni przed wstrzyknięciem SQL (SQL injection) – zostawia tylko liczby

    $anID = filter_var($aID, FILTER_VALIDATE_INT);
    // FILTER_VALIDATE_INT – sprawdza czy po sanityzacji wartość jest poprawną liczbą całkowitą.
    // Zwraca int (liczbę) jeśli tak, lub false jeśli nie.

    if (!is_int($anID)) {
        // is_int() – sprawdza czy $anID jest liczbą całkowitą (nie false).
        echo ('Invalid id'); // Parametr id nie jest liczbą – błąd walidacji
        exit(1);
    }

    $apMySQLi = new \mysqli('localhost', 'root', '', 'MyDB', 3306);
    // Tworzy połączenie z bazą MySQL:
    // – 'localhost' – serwer bazy (ten sam komputer)
    // – 'root'      – nazwa użytkownika MySQL
    // – ''          – hasło (puste, domyślne w XAMPP)
    // – 'MyDB'      – nazwa bazy danych
    // – 3306        – domyślny port MySQL

    if ($apMySQLi->connect_errno) {
        // connect_errno – kod błędu połączenia (0 = brak błędu)
        echo('connect_errno: ' . $apMySQLi->connect_errno . '; ' . $apMySQLi->connect_error);
        // Wypisuje kod i treść błędu połączenia
        exit(1);
    }

    $astrQuery = 'SELECT * FROM MyTable WHERE id = ' . $anID;
    // Buduje zapytanie SQL: pobiera wszystkie kolumny rekordu z podanym id.
    // $anID jest już zwalidowaną liczbą całkowitą – bezpieczne wstawienie do SQL.

    $aResult = $apMySQLi->query($astrQuery);
    // Wykonuje zapytanie na bazie danych.
    // Zwraca obiekt MySQLi_Result przy SELECT lub false przy błędzie.

    if (!($aResult instanceof MySQLi_Result)) {
        // instanceof – sprawdza czy $aResult jest obiektem klasy MySQLi_Result.
        // Jeśli false – zapytanie się nie powiodło.
        echo ('errno=' . $apMySQLi->errno . '; ' . $apMySQLi->error);
        // Wypisuje kod i opis błędu SQL
        exit(1);
    }

    $aRow = $aResult->fetch_assoc();
    // fetch_assoc() – pobiera jeden wiersz z wyniku zapytania jako tablicę asocjacyjną.
    // Klucze tablicy = nazwy kolumn: $aRow['FirstName'], $aRow['Surname'], itd.
    // Zwraca null jeśli nie ma żadnego wiersza (id nie istnieje w bazie).

    if (!is_array($aRow)) {
        // Jeśli $aRow nie jest tablicą – rekord o podanym id nie istnieje.
        echo ('No data for id');
        exit(1);
    }

    $astrAdded   = $aRow['Added']     ?? 'No data';
    // ?? (null coalescing operator) – jeśli $aRow['Added'] jest null, użyj 'No data'.
    // Zabezpieczenie: kolumna mogłaby nie istnieć lub mieć wartość NULL.

    $astrName    = $aRow['FirstName'] ?? 'No name';    // Imię osoby
    $astrSurname = $aRow['Surname']   ?? 'No surname'; // Nazwisko osoby
    $anAge       = $aRow['Age']       ?? 'No age';     // Wiek osoby

    echo "<div>Dodano <b>($astrAdded)</b></div>";
    // Wypisuje datę dodania rekordu wewnątrz elementu HTML <div>.
    // <b> – pogrubienie wartości.

    echo "<div>Imię <b>$astrName</b></div>";
    // Interpolacja zmiennej w stringu – $astrName jest wstawiane bezpośrednio.
    // UWAGA: w kodzie produkcyjnym należałoby użyć htmlspecialchars() dla bezpieczeństwa XSS.

    echo "<div>Nazwisko <b>$astrSurname</b></div>"; // Wypisuje nazwisko
    echo "<div>Wiek <b>$anAge</b></div>";            // Wypisuje wiek

    $apMySQLi->close();
    // Zamyka połączenie z bazą danych. Zwalnia zasoby – dobra praktyka.
    ?>
</body>
</html>
```
