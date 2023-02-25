<?php
require('connection.php');
require('functions.php');

$username = $_POST['name'];
$pwd = hash('sha256', $_POST['password']);
if (in_array($username, get_all_used_usernames($conn))) {
    $result = $conn->query("SELECT Pwd FROM Users WHERE Username='$username'");
    $pwd_on_db = mysqli_fetch_array($result)['Pwd'];
    echo $pwd;
    if($pwd==$pwd_on_db){
        echo 'login effettuato';
    }
}else{
    header("Location: http://localhost/heychat/html/error_page.html");
}
?>