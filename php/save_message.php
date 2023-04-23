<?php

/** SAVES MESSAGES INTO THE DB */

require('connection.php');
//Set values from POST
$_POST[':content'] = trim($_POST['content']);
$_POST[':format'] = $_POST['format'];
$_POST[':userid'] = $_POST['userid'];
$_POST[':chatid'] = $_POST['chatid'];
unset($_POST['content']);
unset($_POST['format']);
unset($_POST['userid']);
unset($_POST['chatid']);

if ($_POST[':format'] == 'image') {
    require('save_image.php');
}

$query = "INSERT INTO messages(Content, Format, UserID, ChatID) VALUES (:content, :format, :userid, :chatid)";
try {
    $stmt = $conn->prepare($query);
    $stmt->execute($_POST);
} catch (PDOException $e) {
    echo json_encode($e);
}
$conn = null;
?>