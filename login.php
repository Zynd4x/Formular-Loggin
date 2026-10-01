<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meine_datenbank";

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

$sql = "SELECT id, name, email FROM benutzer";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Ausgabe der Daten jeder Zeile
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"] . " - Name: " . $row["name"] . " - E-Mail: " . $row["email"] . "<br>";
    }
} else {
    echo "Keine Ergebnisse gefunden";
}

$conn->close();
?>