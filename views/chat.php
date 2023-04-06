<!DOCTYPE html>
<html lang="en">
<?php
session_start();
$my_username = $_SESSION["Username"];
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/styleChat.css">
    <link rel="stylesheet" href="../css/newuser.css">
    <link rel="stylesheet" href="../css/chatSearch.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script src="../js/client.js"></script>
    <script src="../js/chatManager.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <title>HeyChat</title>
</head>

<body onload="loadChats()">
    <input type="hidden" id="me" value="">
    <div id="lat-bar">
        <div id="logo">
            <img src="../img/ui/logo.png">
            <span>HeyChat</span>
        </div>

        <div id="contatti-box">
            <span>Contatti</span>
            <div id="list-chat" class="zerochat centra">

                <h2 id="nochats" class="mostra">Nessuna chat attiva</h2>

            </div>
        </div>
    </div>
    <div id="chat-box">

        <div id="hellocontainter" class="nascondi">
            <div id="hellotopbox">
                <div id="helloMessage">Benvenuto!</div>
                <img src="../img/ui/hey.png">
            </div>
            <div class="line"></div>
            <div id="helloDescription">Cerca i tuoi amici e inizia a chattare con HeyChat</div>
            <div id="addUser">+ &nbsp;&nbsp;Aggiungi contatto</div>
        </div>



        <div id="searchTAG" class="mostra">
            <span>Cerca tramite tag</span>
            <div id="searchbar">
                <span>@</span>
                <input id="inputTag" type="text" oninput="getUsersList()">
                <div id="buttonPlus" onclick="startChat(document.getElementById('inputTag').value)">
                    +</div>
            </div>
            <div id="userTrovati">

            </div>
        </div>
    </div>
</body>
<script>
    var me = '<?php echo $my_username; ?>';
    setUsername(me);

    const params = new URLSearchParams(window.location.search);
    if (params.get('new') == 'true') {
        $('#hellocontainer').removeClass('nascondi');
        $('#hellocontainer').addClass('mostra');
    } else {
        $('#searchTAG').removeClass('nascondi');
        $('#searchTAG').addClass('mostra');
    }

    function getUsersList() {
        let data = $("#inputTag").val();
        $.post('../php/get_user.php', { search: data }, function (response) {
            // Gestire la risposta del server qui
            utenti = JSON.parse(response);
            $("#userTrovati").empty();
            utenti.forEach(utente => {
                nomeUser = utente["Name"]+" "+utente["Surname"];
                nickUser = utente["Username"];
                image = "../img/data/propics/lowRes/"+utente["PropicPath"];
                $("#userTrovati").append("<div data-name='"+nickUser+"' class='newUser' onclick='riempiCampo(this.dataset.name)'> <div class='newUserImage'><img src='"+image+"'></div> <div class='newUserData'> <div class='newUserName'>"+nomeUser+"</div> <div class='newUserNick'>@"+nickUser+"</div> </div> </div>");
            });
        });
    }

    function riempiCampo(name){
        $("#inputTag").val(name);
    }


</script>

</html>