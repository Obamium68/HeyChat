<?php
/**
 * Returns the id of the user whom username is given by POST under ':username' index
 */
require('connection.php');
$query = "SELECT Id FROM users WHERE Username =:username";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    if($stmt->rowCount()==0){
        die();
    }
    echo json_encode($stmt->fetch());
} catch (PDOException $e) {
    echo $e;
}

$conn = null;
?>