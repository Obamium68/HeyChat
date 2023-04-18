<?php
require('connection.php');
$query = "SELECT Username, Id FROM users";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    die($e);
}
$conn = null;
?>