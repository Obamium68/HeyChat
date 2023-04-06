<?php
/**
 * Returns a chat messages and their related info given a chadID via POST under ':chatid' index
 */
require('connection.php');
$query = "SELECT * FROM messages WHERE ChatID =:chatid";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo $e;
}

$conn = null;
?>