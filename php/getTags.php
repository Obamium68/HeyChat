<?php
require('connection.php');

$query = "SELECT Username FROM users";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo $e;
}
$conn = null;
?>