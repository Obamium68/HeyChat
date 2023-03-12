<?php
require('connection.php');
//Extract and trim values from POST
$_POST[':name'] = trim($_POST[':name']);
$_POST[':surname'] = trim($_POST[':surname']);
$_POST[':username'] = trim($_POST[':username']);
$_POST[':password'] = hash('sha256', $_POST[':password']);

$query = "INSERT INTO USERS(Username, Name, Surname, Pwd) VALUES (:username,:name,:surname,:password)";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
} catch (PDOException $e) {
    echo '{"State":1}'; //STATE 1: Username duplicato
    die();
}
echo '{"State":2,"Id":"'.hash('md5',$conn->lastInsertId()).'"}'; //STATE 2: Registrazione avvenuta correttamente
$conn = null;
?>