

/** Takes the following parameters and 
 * 
 * @param {*} ownerID chat's owner ID
 * @param {*} receiverID other chat partecipant ID
 * @param {*} chatName chat name
 */
function saveChat(ownerID, receiverID, chatName) {
    $.post('../php/create_chat.php', { participants: 2, ownerId: ownerID, receiverID: receiverID, chatName: chatName }, function (response) {
        // Gestire la risposta del server qui
        console.log(response);
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


const socket = new WebSocket('ws://localhost:8080');
if (socket) {
    sendUsername()
}
var myUsername = "UNDEFINED";
var connectedHosts = [];    //Host connected to the same server

/**Set the username of the client
 * 
 * @param {*} username 
 */
function setUsername(username) {
    myUsername = username;
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (true) {
        case data.from == 'كنية':             // If server is sending you your ID
            myUsername = data.message;              // Set your id
            break;
        case data.from == 'хозяева':          // If server is sending you the connected hosts
            const hosts = data.message.split(',');
            connectedHosts = hosts;
            console.log(connectedHosts);
            break;
        default:
            const messages = document.getElementById('messages');
            console.log(data);
            switch (data.type) {
                case 'text':
                    const li = document.createElement('li');
                    li.textContent = `${data.from == myUsername ? "You" : data.from}: ${data.message}`;
                    messages.appendChild(li);
                    break;
                case 'image':
                    const img = document.createElement('img');
                    img.src = data.message;
                    messages.appendChild(img);
                    break;
            }
            break;
    }
}

/**
 * 
 * @param {String} from sender ID
 * @param {String} type what does the message contains [text|image]
 * @param {String} message actual content of the messag
 * @param {*} to receiver(s) of the message
 * @returns 
 */
function formatMessage(from, type, message, to) {
    const data = { from, type, message };
    if (to) {
        data.to = to;
    }
    return data;
}

/**
 * Sends the server the username
 */
function sendUsername(user) {
    socket.send(JSON.stringify(formatMessage(myUsername, 'text', user, myUsername)));
}

/**
 * Takes the input message in #message and the receiver in #to (optional)
 */
function sendMessage() {
    const to = document.getElementById('to').value;
    const message = document.getElementById('message').value;
    socket.send(JSON.stringify(formatMessage(myUsername, 'text', message, to)));
}


/**
 * send to #to the image loaded from the input form
 * @returns null if not image charged
 */
function sendImage() {
    const file = document.getElementById('file').files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const to = document.getElementById('to').value;
        socket.send(JSON.stringify(formatMessage(myUsername, 'image', reader.result, to)));
    };
}

