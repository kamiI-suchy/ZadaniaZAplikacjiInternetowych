<?php
declare(strict_types=1);

$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$dbName = getenv('DB_NAME') ?: 'zadanie_php1';

$idInput = $_GET['id'] ?? null;
$id = filter_var($idInput, FILTER_VALIDATE_INT);

if ($id === false || $id === null) {
    http_response_code(400);
    echo '<h1>Błąd 400</h1>';
    echo '<p>Podaj poprawny parametr <code>id</code>, np. <code>?id=1</code>.</p>';
    exit;
}

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo '<h1>Błąd połączenia z bazą danych</h1>';
    echo '<p>' . htmlspecialchars($mysqli->connect_error, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>';
    exit;
}

$stmt = $mysqli->prepare('SELECT id, imie, nazwisko FROM osoby WHERE id = ?');
if (!$stmt) {
    http_response_code(500);
    echo '<h1>Błąd SQL</h1>';
    echo '<p>Nie udało się przygotować zapytania.</p>';
    $mysqli->close();
    exit;
}

$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result ? $result->fetch_assoc() : null;

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zadanie PHP 1</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    table { border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #222; padding: 8px 12px; }
  </style>
</head>
<body>
  <h1>Wynik zapytania dla id=<?= htmlspecialchars((string)$id, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></h1>

  <?php if ($row): ?>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Imię</th>
          <th>Nazwisko</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><?= htmlspecialchars((string)$row['id'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
          <td><?= htmlspecialchars((string)$row['imie'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
          <td><?= htmlspecialchars((string)$row['nazwisko'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></td>
        </tr>
      </tbody>
    </table>
  <?php else: ?>
    <p>Nie znaleziono rekordu dla podanego id.</p>
  <?php endif; ?>
</body>
</html>
<?php
$stmt->close();
$mysqli->close();
