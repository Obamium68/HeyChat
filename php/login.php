<?php
require('connection.php');
//Extract and trim values from POST
$_POST[':username'] = trim($_POST[':username']);
$_POST[':password'] = hash('sha256', $_POST[':password']);


$query = "SELECT Id, Username FROM users WHERE Username=:username AND Pwd=:password";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
} catch (PDOException $e) {
    header('Location: ../views/Index.html?err=1');
    die();
}
switch ($stmt->rowCount()) {
    case 0:
        header('Location: ../views/Index.html?err=2');
        break;
    case 1:
        session_start();
        $row = $stmt->fetch();
        $_SESSION['Username'] = $row['Username'];
        $_SESSION['Id'] = $row['Id'];
        $_SESSION['State'] = 'NotNew';
        header('Location: ../views/chat.php');
        break;
}
$conn = null;
die();
?>