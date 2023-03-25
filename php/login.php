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
        echo '{"State":3}'; //STATE 3 : Utente non trovato
        break;
    case 1:
        echo '{"State":4,"Id":"' . hash('md5', $stmt->fetch()[0]) . '"}'; //STATE 4 : Credenziali corrette
        break;
}
$conn = null;







?>