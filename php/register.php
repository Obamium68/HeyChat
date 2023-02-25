<?php
require('connection.php');
//Extract and trim values from POST
$name = trim($_POST['name']);
$surname = trim($_POST['surname']);
$username = trim($_POST['username']);
$password = hash('sha256', $_POST['password']);

if (in_array($username, get_all_used_usernames($conn))) {       //If username is alrady used
    header("Location: http://localhost/heychat/html/error_page.html");  //Redirect to error page
} else {
    $insert = "INSERT INTO USERS(Username, Name, Surname, Pwd) VALUES ('$username','$name','$surname','$password')";
    if ($conn->query($insert) === TRUE) {
        echo "New record created successfully";
    } else {
        header("Location: http://localhost/heychat/html/error_page.html");
    }
}

/**
 * Return all used usernames in the database
 */
function get_all_used_usernames($conn)
{
    $used_usernames = array();
    $result = $conn->query("SELECT Username FROM Users");
    while ($row = mysqli_fetch_array($result)) {
        array_push($used_usernames, $row['Username']);
    }
    return $used_usernames;
}
?>