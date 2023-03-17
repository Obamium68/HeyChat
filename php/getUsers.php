<?php
require('connection.php');
if(isset($_POST['user'])){ //If client is asking for a specific user
    $query = "SELECT Name, Surname, Username FROM users WHERE Username=:username";
    try {
        $stmt = $conn->prepare($query);
        $stmt->bindParam('username', $_POST['user'], PDO::PARAM_STR);
        $stmt->execute();
        echo json_encode($stmt->fetch());
    } catch (PDOException $e) {
        echo $e;
    }
}else{
    $query = "SELECT * FROM users";
    try {
        $stmt = $conn->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll());
    } catch (PDOException $e) {
        echo $e;
    }
}
$conn = null;
?>