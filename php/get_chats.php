<?php
/**
 * Returns all chats and their related info the user having 'userID' [via POST] joined
 */
require('connection.php');
$myID[':myID']=$_POST['myID'];
$result;  //conterrà il risultato finale

$query = "SELECT chats.Name, chats.Id FROM participations JOIN chats ON participations.chatID = chats.Id WHERE participations.UserID=:myID and chats.nPart>2";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($myID);
    $result1 = $stmt->fetchAll();
} catch (PDOException $e) {
    echo $e;
}

$query = "SELECT participations.ChatID ,users.Username, users.Name, users.Surname
FROM participations JOIN users ON participations.UserID = users.Id
WHERE participations.ChatID IN (
    SELECT participations.ChatID FROM participations JOIN chats ON participations.chatID = chats.Id WHERE participations.UserID=:myID AND chats.nPart=2
	) and participations.UserID != :myID";

try {
    $stmt = $conn->prepare($query);
    $stmt->execute($myID);
    $result2 = $stmt->fetchAll();
} catch (PDOException $e) {
    echo $e;
}

// Concatena i due risultati in un unico array
$result = array_merge($result1, $result2);

// Codifica l'array come JSON
echo(json_encode($result));

$conn = null;
?>