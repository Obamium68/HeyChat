<?php
/**
 * Returns all chats and their related info the user having 'userID' [via POST] joined
 */
require('connection.php');
$myID[':myID']=$_POST['myID'];
$query = "SELECT chats.Name, chats.Id FROM participations JOIN chats ON participations.chatID = chats.Id WHERE participations.UserID=:myID";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($myID);
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo $e;
}

$conn = null;
?>