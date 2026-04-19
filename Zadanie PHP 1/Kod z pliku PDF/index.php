<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <?php
    if (!filter_has_var(INPUT_GET, 'id')) {
        echo ('Missing id');
        exit(1);
    }

    $aID = filter_var($_REQUEST['id'], FILTER_SANITIZE_NUMBER_INT);
    $anID = filter_var($aID, FILTER_VALIDATE_INT);

    if (!is_int($anID)) {
        echo ('Invalid id');
        exit(1);
    }

    $apMySQLi = new \mysqli('localhost', 'root', '', 'MyDB', 3306);
    if ($apMySQLi->connect_errno) {
        echo('connect_errno: ' . $apMySQLi->connect_errno . '; ' . $apMySQLi->connect_error);
        exit(1);
    }
    $astrQuery = 'SELECT * FROM MyTable WHERE id = ' . $anID;
    $aResult = $apMySQLi->query($astrQuery);
    if (!($aResult instanceof MySQLi_Result)) {
        echo ('errno=' . $apMySQLi->errno . '; ' . $apMySQLi->error);
        exit(1);
    }
    $aRow = $aResult->fetch_assoc();
    if (!is_array($aRow)) {
        echo ('No data for id');
        exit(1);
    }
    $astrAdded = $aRow['Added'] ?? 'No data';
    $astrName = $aRow['FirstName'] ?? 'No name';
    $astrSurname = $aRow['Surname'] ?? 'No surname';
    $anAge = $aRow['Age'] ?? 'No age';

    echo "<div>Dodano <b>($astrAdded)</b></div>";
    echo "<div>Imię <b>$astrName</b></div>";
    echo "<div>Nazwisko <b>$astrSurname</b></div>";
    echo "<div>Wiek <b>$anAge</b></div>";
    $apMySQLi->close();
    ?>

</body>
</html>