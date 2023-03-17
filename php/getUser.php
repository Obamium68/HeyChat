<?php
require('connection.php');
echo json_encode($_POST);
$query = "SELECT Name, Surname, Username FROM users WHERE Username=:username";
try {
    $stmt = $conn->prepare($query);
    $stmt->bindParam('username', $_POST['user'], PDO::PARAM_STR);
    $stmt->execute();
    echo json_encode($stmt->fetch());
} catch (PDOException $e) {
    echo $e;
}
$conn = null;
?>