//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE PHP PAGES     -Loaded in chat.php*/


var myUsername = "UNDEFINED";
var myID = 0;

/**Set the username of the client
 * 
 * @param {*} username 
 */
function setUsername(username) {
    console.log(username);
    myUsername = username;
}

/**Set the id of the client
 * 
 * @param {*} id 
 */
function setID(id) {
    myID = id;
}


/**
 * send the parameters to the DB to store the chat that is gonna be created if no error is thrown
 */
function startChat(name, receiver) {
    if (receiver) {
        let ownerID = myID;
        let chatName = name;
        let partecipants = 0;
        let receivers = [];
        //Se mi è passato un array allora è un gruppo, se no è una chat privata
        if (Array.isArray(receiver)) {
            receivers = receiver;
            partecipants = receivers.length + 1;
        } else {
            console.log($('div[data-name="' + receiver + '"].newUser').attr('data-id'));
            receivers.push($('div[data-name="' + receiver + '"].newUser').attr('data-id'));
            chatName = "Private chat";
            partecipants = 2;
        }

        saveChat(partecipants, ownerID, receivers, chatName);
    }
}

function loadChats() {
    $.post('../php/get_chats.php', { myID: myID }, function (response) {
        chats = JSON.parse(response);
        if (chats.length > 0) {
            $("#list-chat").empty();
            $("#list-chat").removeClass("zerochat");
            $("#list-chat").removeClass("centra");
        }
        chats.forEach(chat => {
            if ("Username" in chat) {
                displayChatBar(chat["ChatID"], chat["Name"] + " " + chat["Surname"], chat["Username"], 0);
            } else {
                displayGroupBar(chat["Id"], chat["Name"])
            }
        });
    });
}

function displayChatBar(id, nome, username, state) {
    //bisogna gestire lo state
    $("#list-chat").append("<div data-id='" + id + "' class='chat'> <div class='user'><img src='https://random.imagecdn.app/65/65'> <div class='dati'> <div class='nome'>" + nome + "</div> <div class='nickname'>@" + username + "</div></div></div><div class='state'><div class='point-state'>&nbsp;</div></div></div>");
}

function displayGroupBar(id, nome) {
    $("#list-chat").append("<div data-id='" + id + "' class='chat'> <div class='group'><img src='https://random.imagecdn.app/65/65'> <div class='dati'> <div class='nome'>" + nome + "</div> </div></div> <div class='state'><div class='point-state'>&nbsp;</div></div> </div>");
}

/** Takes the following parameters and 
 * 
 * @param {*} ownerID chat's owner ID
 * @param {*} receiverID other chat partecipant ID
 * @param {*} chatName chat name
 */
function saveChat(partecipants, ownerID, receiverID, chatName) {
    $.post('../php/create_chat.php', { participants: partecipants, ownerId: ownerID, receivers: receiverID, chatName: chatName }, function (response) {
        console.log(response);
        // Gestire la risposta del server qui
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Nuova chat aggiunta',
            showConfirmButton: false,
            timer: 1500
        });
        $("#searchTAG").fadeOut(600);
    });
}


