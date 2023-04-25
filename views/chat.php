<!DOCTYPE html>
<html lang="en">
<?php
session_start();
if (isset($_SESSION["Username"])) {
    $my_username = $_SESSION["Username"];
    $my_id = $_SESSION['Id'];
    $newSession = False;
    if ($_SESSION["State"] == "New") {
        $newSession = True;
    }
} else {
    header("Location: ../views/Index.html");
}

?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/styleChat.css">
    <link rel="stylesheet" href="../css/newuser.css">
    <link rel="stylesheet" href="../css/chatSearch.css">
    <link rel="stylesheet" href="../css/newGroup.css">
    <link rel="stylesheet" href="../css/chatting.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js"></script>
    <script src="../js/newGroupManager.js"></script>
    <script src="../js/client.js"></script>
    <script type='text/javascript' src="../js/chatManager.js"></script>
    <script src="../js/getemoji.js"></script>
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

        <div id="actions">
            <div id="newContatto" onclick="showFormContact()">
                <div class="buttonaction"><img src="../img/ui/newCont.png" /></div>
                <span>Nuovo contatto</span>
            </div>
            <div id="newGruppo" onclick="showFormGroup()">
                <div class="buttonaction"><img src="../img/ui/newGroup.png" /></div>
                <span>Nuovo gruppo</span>
            </div>
        </div>
    </div>
    <div id="chat-box">

        <div id="chat" data-chatid="0" class="nascondi">
            <div id="sendbox">
                <div id="dataMessage">
                    <div id="other">
                        <img src="../img/ui/smile.png" id="newEmoji" onclick="showEmojiBox()" />
                        <img src="../img/ui/photo.png" id="newImg" />
                    </div>
                    <input type="text" id="textMessage" placeholder="Digita qui il tuo messaggio"
                        onkeydown="if(event.keyCode === 13) sendAndSaveMessage()" />
                </div>
                <div id="sendButton" onclick="sendAndSaveMessage()">
                    <img src="../img/ui/send.png" />
                </div>
            </div>

            <div id="messages">

            </div>


            <div id="contatto">
                <div id="utente">
                    <img src="../img/data/propics/LowRes/default.png" />
                    <span>Mario Rossi</span>
                </div>
                <div id="status" class="nascondi">
                    <div id="online" class="isonline"></div>
                    <div id="nickname"></div>
                </div>

                <div id="infoGroup" class="mostra">Mostra partecipanti</div>
            </div>
        </div>

        <div id="hellocontainer" class="mostra">
            <div id="hellotopbox">
                <div id="helloMessage">Benvenuto!</div>
                <img src="../img/ui/hey.png">
            </div>
            <div class="line"></div>
            <div id="helloDescription">Cerca i tuoi amici e inizia a chattare con HeyChat</div>
            <div id="addUser" onclick="showInput()">+ &nbsp;&nbsp;Aggiungi contatto</div>
        </div>

        <div id="emojibox" class="nascondi">
            <div id="titoloEmo">
                <h3>&nbsp;&nbsp; Aggiungi emoji</h3>
                <div style="
                    margin-right: 15px;
                    color: red;
                    font-weight: 700;
                    cursor: pointer;
                    " id="chiudiemoji">
                    X
                </div>
            </div>
            <div id="containeremoji"></div>
        </div>

        <div id="imagebox" class="nascondi">
            <div id="titoloImg">
                <h3>&nbsp;&nbsp; Carica immagine</h3>
                <div style="
                    margin-right: 15px;
                    color: red;
                    font-weight: 700; 
                    cursor: pointer;
                    " id="chiudiImg">
                    X
                </div>
            </div>
            <div id="containerImg">
                <label for="inserisciImg" class="mostra centra" id="caricafirst">Clicca qui per inserire
                    un'immagine</label>
                <input type="file" id="inserisciImg" />
                <label id="moreImg" class="nascondi" for="inserisciImg">+</label>
            </div>
            <div id="footerImgbox" class="nascondi">
                <div id="sendImg" onclick="sendImage()">Invia foto</div>
            </div>
        </div>

        <div id="searchTAG" class="nascondi">
            <span>Cerca tramite tag</span>
            <div id="searchbar">
                <span>@</span>
                <input id="inputTag" type="text" oninput="displayUsers()">
                <div id="buttonPlus" onclick="startChat('',document.getElementById('inputTag').value)">
                    +</div>
            </div>
            <div id="userTrovati">

            </div>
            <div id="annullaNewContatto" onclick="closeBoxNewContatto()">Annulla</div>
        </div>

        <div id="group-box" class="nascondi">
            <div id="newGroup">
                <span>Crea nuovo gruppo</span>
                <div id="nameGroup">
                    <span>Nome: </span>
                    <input type="text" id="inputNameGroup" oninput="checkNewButton()">
                </div>

                <div id="peopleList"></div>
                <div id="buttonsNewGroupContainer">
                    <div id="createNewGruop" onclick="startGroup()">Crea nuovo gruppo</div>
                    <div id="annullaNewGroup" onclick="closeBoxNewGroup()">Annulla</div>
                </div>
            </div>
        </div>

    </div>
</body>
<script>

    function getUsers() {
        $.post('../php/get_all_users.php', function (response) {
            return (JSON.parse(response));
        });
    }

    function sendAndSaveMessage() {
        if ($('#textMessage').val()) {
            let toSave = sendMessage();
            saveMessage(toSave[0], toSave[1], toSave[2], toSave[3]);
            $('#textMessage').val('');
        }
    }

    var isNew = '<?php echo $newSession; ?>';
    setUsername('<?php echo $my_username; ?>');
    setID('<?php echo $my_id; ?>');

    if (isNew) {
        $('#helloMessage').html('Benvenuto!');
        $('#helloDescription').html('Cerca i tuoi amici e inizia a chattare con HeyChat');
    } else {
        $('#helloMessage').html('Bentornato!');
        $('#helloDescription').html('Clicca su una chat per iniziare a messaggiare');
        $('#addUser').addClass('nascondi');
    }

    function showFormContact() {
        svuotaChatBox();
        $('#searchTAG').removeClass('nascondi');
        $('#searchTAG').addClass('mostra');
    }

    function svuotaChatBox() {
        $('#chat-box > div').removeClass('mostra');
        $('#chat-box > div').addClass('nascondi');
        closeBoxNewContatto();
        closeBoxNewGroup();
    }

    function displayUsers() {
        let data = $("#inputTag").val();
        $.post('../php/get_user.php', { search: data }, function (response) {
            utenti = JSON.parse(response);
            $("#userTrovati").empty();
            utenti.forEach(utente => {
                id = utente['Id'];
                nomeUser = utente["Name"] + " " + utente["Surname"];
                nickUser = utente["Username"];
                //image = "../img/data/propics/lowRes/" + utente["PropicPath"];
                image = "../img/data/propics/lowRes/default.png";
                $("#userTrovati").append("<div data-id='" + id + "' data-name='" + nickUser + "' class='newUser' onclick='riempiCampo(this.dataset.name)'> <div class='newUserImage'><img src='" + image + "'></div> <div class='newUserData'> <div class='newUserName'>" + nomeUser + "</div> <div class='newUserNick'>@" + nickUser + "</div> </div> </div>");
            });
        });
    }

    function riempiCampo(name) {
        $("#inputTag").val(name);
    }

    function closeBoxNewContatto() {
        $('#searchTAG').removeClass('mostra');
        $('#searchTAG').addClass('nascondi');
        $("#userTrovati").empty();
        $("#inputTag").val('');
    }


</script>

</html>