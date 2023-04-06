<?php
require('connection.php');

if($_POST['search']=="") die("{}"); 

$query = "SELECT Name, Surname, Username, PropicPath FROM users WHERE Username LIKE CONCAT(:username, '%')";
try {
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $_POST['search']);
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo $e;
}

$conn = null;
?>