<?php

require('connection.php');

/**
 * Returns all used usernames in the database
 */
 if(isset($_POST['action'])){
    if ($_POST['action'] == "function1") { get_all_used_usernames($conn); }
    if ($_POST['action'] == "function2") { func2(); }
    if ($_POST['action'] == "function3") { func3(); }
    if ($_POST['action'] == "function4") { func4(); }
}
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