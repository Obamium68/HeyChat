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
    
    //Se il div della chat non ha il div dello state (il pallino colorato) significa che è un gruppo
    const pallino = $('div.chat[data-id="' + chatId + '"] .state ');
    if(pallino.length==1){
        if($(pallino[0].children[0]).hasClass("point-state-online")){
            $("#online").html("Online");
            $("#online").removeClass("notonline");
            $("#online").addClass("isonline");
        }else{
            $("#online").html("Offline");
            $("#online").removeClass("isonline");
            $("#online").addClass("notonline");
        }
        $("#nickname").html($('div.chat[data-id="' + chatId + '"] .dataGroup .dati .nickname').html());
    }else{
        
    }
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
            appendMessage(message["Content"], message["SendDate"], message["UserID"]);
        });
    });
}

function appendMessage(content,time, owner) {
    const [dateString, timeString] = time.split(' ');
    const date = new Date(dateString + 'T' + timeString);
    const formattedTime = date.toLocaleTimeString().slice(0, -3); // Rimuove gli ultimi tre caratteri (i secondi)
    if (owner == myID) {
        let messag = $("<div class='mymessage'><div><div class='contentmessage'>" + content + "</div> <div class='timemymessage'>"+formattedTime+"</div></div></div>");
        $("#messages").append(messag);
    } else {
        let messag = $("<div class='fmessage'><div><div class='contentmessage'>" + content + "</div> <div class='timefmessage'>"+formattedTime+"</div></div></div>");
        $("#messages").append(messag);
    }
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
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
        //console.log(response);
    });
}

function displayChatBar(id, nome, username, state) {
    //bisogna gestire lo state
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='user dataGroup'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> <div class='nickname'>@" + username + "</div></div></div><div class='state'><div class='point-state-offline'>&nbsp;</div></div></div>");
}

function displayGroupBar(id, nome) {
    $("#list-chat").append("<div data-id='" + id + "' class='chat' onclick='fetchMessages(" + id + ")'> <div class='group dataGroup'><img src='../img/data/propics/LowRes/default.png'> <div class='dati'> <div class='nome'>" + nome + "</div> </div></div> </div>");
}

/** Takes the following parameters and 
 * 
 * @param {*} ownerID chat's owner ID
 * @param {*} receiverID other chat partecipant ID
 * @param {*} chatName chat name
 */
function saveChat(partecipants, ownerID, receiverID, chatName) {
    $.post('../php/create_chat.php', { participants: partecipants, ownerId: ownerID, receivers: receiverID, chatName: chatName }, function (response) {

        if(partecipants>2)  displayGroupBar(response,chatName);
        else{
            displayChatBar(response,$('div[data-id="' + receiverID + '"].newUser .newUserData .newUserName').html(),$('div[data-id="' + receiverID + '"].newUser .newUserData .newUserNick').html().substring(1),0);
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

