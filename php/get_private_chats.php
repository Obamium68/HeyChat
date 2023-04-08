<?php
require('connection.php');
$myID[':myID'] = $_POST['myID'];

$query = "SELECT users.Id ,users.Username, users.Name, users.Surname
    FROM participations JOIN users ON participations.UserID = users.Id
    WHERE participations.ChatID IN (
        SELECT participations.ChatID FROM participations JOIN chats ON participations.chatID = chats.Id WHERE participations.UserID=:myID AND chats.nPart=2
        ) and participations.UserID != :myID";

try {
    $stmt = $conn->prepare($query);
    $stmt->execute($myID);
    echo (json_encode($stmt->fetchAll()));
} catch (PDOException $e) {
    echo $e;
}
?>