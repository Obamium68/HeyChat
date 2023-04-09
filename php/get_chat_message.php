<?php
/**
 * Returns a chat messages and their related info given a chadID via POST under ':chatid' index
 */
require('connection.php');
$_POST[':chatID']=$_POST['chatID'];
unset($_POST['chatID']);
$query = "SELECT * FROM messages WHERE ChatID =:chatID";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo $e;
}
$conn = null;
?>