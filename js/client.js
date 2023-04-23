//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE PHP PAGES     -Loaded in chat.php*/

var myUsername = "";
var myID = 0;

/**Set the id of the client
 * 
 * @param {int} id 
 */
function setID(id) {
    myID = id;
}

/**Set the username of the client
 * 
 * @param {String} username 
 */
function setUsername(username) {
    myUsername = username;
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
    $.post('../php/get_chats_from_id.php', { myID: myID }, function (response) {
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
                displayGroupBar(chat["Id"], chat["Name"]);
            }
        });

    });
}

/* load chat */
function renderChat(chatId) {
    $("#utente span").html($('div.chat[data-id="' + chatId + '"] .group .dati .nome').html());
}

/** Given a chat id manage all messages sent in that chat
 * 
 * @param {*} chatID 
 */

function fetchMessages(chatID) {
    renderChat(chatID);
    $("#chat").removeClass("nascondi");
    $("#chat").addClass("mostra");
    $("#chat").attr("data-chatid", chatID);
    $.post('../php/get_chat_messages.php', { chatID: chatID }, function (response) {
        let messages = JSON.parse(response);
        $("#messages").empty();
        messages.forEach(message => {
            appendMessage(message["Content"], message["UserID"]);
        });
    });
}

function appendMessage(content, owner) {
    if (owner == myID) {
        let messag = $("<div class='mymessage'><div>" + content + "</div></div>");
        $("#messages").append(messag);
    } else {
        let messag = $("<div class='fmessage'><div>" + messag["Content"] + "</div></div>");
        $("#messages").append(messag);
    }
}

/** Save the message into the db
 * 
 * @param {String} content 
 * @param {String} format 'text'|'image' 
 * @param {Int} userid 
 * @param {Int} chatid 
 */
function saveMessage(content, format, userid, chatid) {
    $.post('../php/save_message.php', { content: content, format: format, userid: userid, chatid: chatid }, function (response) {
        console.log(response);
    });
}

function displayChatBar(id, nome, username, state) {
    //bisogna gestire lo state
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='user'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> <div class='nickname'>@" + username + "</div></div></div><div class='state'><div class='point-state-offline'>&nbsp;</div></div></div>");
}

function displayGroupBar(id, nome) {
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='group'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> </div></div> <div class='state'></div> </div>");
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

function showEmojiBox() {

}

