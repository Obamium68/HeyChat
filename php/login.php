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
    echo $e;
}
switch ($stmt->rowCount()) {
    case 0:
        header('Location: ../views/Index.html?err=2');
        break;
    case 1:
        session_start();
        $_SESSION['Username']=$stmt->fetch()['Username'];
        $_SESSION['Id']=$stmt->fetch()['Id'];
        $_SESSION['State']='NotNew';
        header('Location: ../views/chat.php');
        break;
}
$conn = null;
die();
?>