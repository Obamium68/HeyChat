<?php
require('connection.php');
$query = "SELECT UserID, ChatID FROM participations";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    die($e);
}
$conn = null;
?>