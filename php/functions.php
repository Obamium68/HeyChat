<?php

require('connection.php');

/**
 * Returns all used usernames in the database
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