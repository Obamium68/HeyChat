<?php
require('connection.php');
//Extract and trim values from POST
$_POST[':name'] = trim($_POST[':name']);
$_POST[':surname'] = trim($_POST[':surname']);
$_POST[':username'] = trim($_POST[':username']);
$_POST[':password'] = hash('sha256', $_POST[':password']);
if (empty($_POST[':username'])) {
    echo '{"State":-1}'; //STATE -1: campo vuoto
    die();
}
$query = "INSERT INTO USERS(Username, Name, Surname, Pwd) VALUES (:username,:name,:surname,:password)";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    session_start();
    $_SESSION['State'] = 'New';
    $_SESSION['Username'] = $stmt->fetch()['Username'];
    $_SESSION['Id'] = $conn->lastInsertId();
    header('Location: ../views/chat.php');
} catch (PDOException $e) {
    header('Location: ../views/Index.html?err=1');
    die();
}
$conn = null;
?>