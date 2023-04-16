<?php
require('connection.php');

if ($_POST['search'] == "")
    die("{}");

//$query = "SELECT Id, Name, Surname, Username, PropicPath FROM users WHERE Username LIKE CONCAT(:username, '%')";
$query = "SELECT Id, Name, Surname, Username FROM users WHERE Username LIKE CONCAT(:username, '%')";
try {
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $_POST['search']);
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    die($e);
}

$conn = null;
?>