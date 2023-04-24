<?php
/**
 * Save onto the db the chat newly created and the partecipation of two ginven members
 */
require('connection.php');
$data[':participants'] = trim($_POST['participants']);
$data[':ownerId'] = $_POST['ownerId'];
$data[':chatName'] = trim($_POST['chatName']);

$query = "INSERT INTO chats(nPart, Owner, Name) VALUES (:participants,:ownerId,:chatName)";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($data);
} catch (PDOException $e) {
    die($e);
}
$chatId = $conn->lastInsertId();
$query = "INSERT INTO participations(UserID, ChatID) VALUES (:userId,:chatId)";
try {

    $stmt = $conn->prepare($query);

    //Aggiungo la partecipazione del proprietario
    $stmt->bindParam(':userId', $data[':ownerId']);
    $stmt->bindParam(':chatId', $chatId);
    $stmt->execute();

    //Aggiungo la partecipazione per ogni utente
    $receivers = $_POST['receivers'];
    foreach ($receivers as $receiver) {
        $stmt->bindParam(':userId', $receiver);
        $stmt->bindParam(':chatId', $chatId);
        $stmt->execute();
    }

    echo json_encode($chatId);
} catch (PDOException $e) {
    die($e);
}

$conn = null;
?>