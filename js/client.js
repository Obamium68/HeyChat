//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE PHP PAGES     -Loaded in chat.php*/

var myUsername = "";
var myID = 0;
var openChat = -1;

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
            //console.log($('div[data-name="' + receiver + '"].newUser').attr('data-id'));
            receivers.push($('div[data-name="' + receiver + '"].newUser').attr('data-id'));
            chatName = "Private chat";
            partecipants = 2;
        }
        saveChat(partecipants, ownerID, receivers, chatName);
        setTimeout(function () { location.reload() }, 1500);
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
    svuotaChatBox();

    openChat = chatId;
    $("#utente span").html($('div.chat[data-id="' + chatId + '"] .dataGroup .dati .nome').html());

    //Svuoto il pallino dei messaggi da leggere
    $('div.chat[data-id="' + chatId + '"] .state > div').html('');
    $('div.chat[data-id="' + chatId + '"] .state > div').removeClass('newMessages');

    const checkChat = $('div.chat[data-id="' + chatId + '"] .dataGroup .dati .nickname');
    if (checkChat.length == 0) {
        $("#status").removeClass("mostra");
        $("#status").addClass("nascondi");

        $("#infoGroup").removeClass("nascondi");
        $("#infoGroup").addClass("mostra");
    } else {
        $("#infoGroup").removeClass("mostra");
        $("#infoGroup").addClass("nascondi");

        $("#status").removeClass("nascondi");
        $("#status").addClass("mostra");
        //Se il div della chat non ha il div dello state (il pallino colorato) significa che è un gruppo
        const pallino = $('div.chat[data-id="' + chatId + '"] .state ');

        if ($(pallino[0].children[0]).hasClass("point-state-online")) {
            $("#online").html("Online");
            $("#online").removeClass("notonline");
            $("#online").addClass("isonline");
            console.log("È onimi");
        } else {
            $("#online").html("Offline");
            $("#online").removeClass("isonline");
            $("#online").addClass("notonline");
            console.log("È off");
        }
        $("#nickname").html($('div.chat[data-id="' + chatId + '"] .dataGroup .dati .nickname').html());

    }
    $("#chat").removeClass("nascondi");
    $("#chat").addClass("mostra");
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


    const checkChat = $('div.chat[data-id="' + chatID + '"] .dataGroup .dati .nickname');
    $.post('../php/get_chat_messages.php', { chatID: chatID }, function (response) {
        $("#messages").empty();
        if (checkChat.length == 0) {

        } else {
            let messages = JSON.parse(response);

            messages.forEach(message => {
                if (message["Format"] == "text") appendMessage('', message["Content"], message["SendDate"], message["UserID"]);
                //if (message["Format"] == "image") appendImage('', "http://localhost/GitHub/HeyChat/img/data/chats/" + message["Content"] + ".png", message["SendDate"], message["UserID"])
                if (message["Format"] == "image") appendImage('', "http://localhost/HeyChat/img/data/chats/" + message["Content"] + ".png", message["SendDate"], message["UserID"])
            });
            setTimeout(function () {
                $("#messages").resize();
                $("#messages").scrollTop($("#messages")[0].scrollHeight);
            }, 1);
        }
    });
}

function formattaOrario(time) {
    const [dateString, timeString] = time.split(' ');
    const date = new Date(dateString + 'T' + timeString);
    const formattedTime = date.toLocaleTimeString().slice(0, -3); // Rimuove gli ultimi tre caratteri (i secondi)
    return formattedTime
}

function appendMessage(sender, content, time, owner) {
    formattedTime = formattaOrario(time);
    if (owner == myID) {
        let messag = $("<div class='mymessage'><div><div class='contentmessage'>" + content + "</div> <div class='timemymessage'>" + formattedTime + "</div></div></div>");
        $("#messages").append(messag);
    } else {
        let messag = $("<div class='fmessage'><div><div class='sender'>" + sender + "</div><div class='contentmessage'>" + content + "</div> <div class='timefmessage'>" + formattedTime + "</div></div></div>");
        $("#messages").append(messag);
    }
}

function appendImage(sender, path, time, owner) {
    formattedTime = formattaOrario(time);
    if (owner == myID) {
        let photo = $("<div class='mymessage'><div><div class='imageMessage'><img src='" + path + "'></div> <div class='timemymessage'>" + formattedTime + "</div></div></div>");
        $("#messages").append(photo);
    } else {
        let photo = $("<div class='fmessage'><div><div class='sender'>" + sender + "</div><div class='imageMessage'><img src='" + path + "'></div> <div class='timefmessage'>" + formattedTime + "</div></div></div>");
        $("#messages").append(photo);
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
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='user dataGroup'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> <div class='nickname'>@" + username + "</div></div></div><div class='state'><div class='point-state-offline'></div></div></div>");
}

function displayGroupBar(id, nome) {
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='group dataGroup'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> </div></div> <div class='state'><div></div></div> </div>");
}

/** Takes the following parameters and 
 * 
 * @param {*} ownerID chat's owner ID
 * @param {*} receiverID other chat partecipant ID
 * @param {*} chatName chat name
 */
function saveChat(partecipants, ownerID, receiverID, chatName) {
    $.post('../php/create_chat.php', { participants: partecipants, ownerId: ownerID, receivers: receiverID, chatName: chatName }, function (response) {

        if (partecipants > 2) displayGroupBar(response, chatName);
        else {
            displayChatBar(response, $('div[data-id="' + receiverID + '"].newUser .newUserData .newUserName').html(), $('div[data-id="' + receiverID + '"].newUser .newUserData .newUserNick').html().substring(1), 0);
        }

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Nuova chat aggiunta',
            showConfirmButton: false,
            timer: 1500
        });
        svuotaChatBox();
    });
}

function showEmojiBox() {

}

