<?php
// Initialize the session
session_start();

// Check if the user is logged in, if not then redirect him to login page
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login.php");
    exit;
}
?>

<html>

<head>
    <title>Welcome</title>
</head>

<body>
    <div style="text-align:center;">
        <p>Wow! This ia pretty page.. hehe.</p>
        <a href="https://elele.team">Check out Elele.Team!</a>
    </div>


</body>

</html>