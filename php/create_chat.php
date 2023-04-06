<?php
/**
 * Save onto the db the chat newly created and the partecipation of two ginven members
 */
require('connection.php');
var_dump($_POST);
$data[':participants'] = trim($_POST['participants']);
$data[':ownerId'] = $_POST['ownerId'];
$data[':chatName'] = trim($_POST['chatName']);

$query = "INSERT INTO chats(nPart, Owner, Name) VALUES (:participants,:ownerId,:chatName)";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($data);
} catch (PDOException $e) {
    echo $e;
}
$chatId = $conn->lastInsertId();
$query = "INSERT INTO participations(UserID, ChatID) VALUES (:userId,:chatId)";
 try {
     $stmt = $conn->prepare($query);
     $stmt->bindParam(':userId', $data[':ownerId']);
     $stmt->bindParam(':chatId', $chatId);
     $stmt->execute();

     $stmt->bindParam(':userId', $_POST['receiverID']);
     $stmt->bindParam(':chatId', $chatId);
     $stmt->execute();
 } catch (PDOException $e) {
     echo $e;
 }

$conn = null;
?>