<?php
/**
 * Returns a chat messages and their related info given a chadID via POST under ':chatid' index
 */
require('connection.php');
$_POST[':chatID'] = $_POST['chatID'];
unset($_POST['chatID']);
$query = "SELECT Content, Format, SendDate, UserID, Name, Surname, Username
        FROM messages JOIN users ON messages.UserID=users.Id
        WHERE ChatID =:chatID";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    die($e);
}
$conn = null;
?>