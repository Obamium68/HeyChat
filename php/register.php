<?php
require('connection.php');
require('functions.php');
//Extract and trim values from POST
$name = trim($_POST['name']);
$surname = trim($_POST['surname']);
$username = trim($_POST['username']);
$password = hash('sha256', $_POST['password']);

if (in_array($username, get_all_used_usernames($conn))) {       //If username is alrady used
    echo '{"err": 1}'; //Username already used
} else {
    $insert = "INSERT INTO USERS(Username, Name, Surname, Pwd) VALUES ('$username','$name','$surname','$password')";
    if ($conn->query($insert)) {
        echo '{"err": 0}'; //OK
    } else {
        echo '{"err": 2}';
    }
}
?>