<?php
/**
 * Returns the id of the user whom username is given by POST under ':username' index
 */
require('connection.php');
$query = "SELECT Username FROM users WHERE Id =:id";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    if ($stmt->rowCount() == 0) {
        die();
    }
    echo json_encode($stmt->fetch());
} catch (PDOException $e) {
    die($e);
}

$conn = null;
?>