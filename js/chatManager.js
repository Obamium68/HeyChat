//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE SERVER     -Loaded in chat.php*/


var connectedHosts = [];    //Host connected to the same server



const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    sendData();
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    switch (true) {
        case data.type == 'хозяева':          // If server is sending you the connected hosts
            //**TODO GIANLUCA GESTISCI GLI USER ONLINE CHE SI TROVANO IN 'data.message' sottoforma di arrayy :)))))!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
            break;
        default:
            const messages = document.getElementById('messages');       //TO-DO gestisci il render
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
function sendData() {
    socket.send(JSON.stringify(formatMessage(myID, 'text', 'online', "server")));
}

/**
 * Takes the input message in #message and the receiver in #to, send the message and sends it
 */
function sendMessage() {
    const message = document.getElementById('textMessage').value;
    const chatid = $("#chat").attr("data-chatid");

    socket.send(JSON.stringify(formatMessage(myID, 'text', message, chatid)), (err) => {
        if (err) {
            throw err;
        }
        saveMessage(message, 'text', myID, chatid);
        appendMessage(message, myID);
    });
}


/**
 * send to #to the image loaded from the input form
 * @returns null if not image charged
 */
function sendImage(chatid) {
    const file = document.getElementById('file').files[0];
    if (!file) {
        //TO-DO Gianluca gestisci errore :)
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        socket.send(JSON.stringify(formatMessage(myID, 'image', reader.result, chatid)), (err) => {
            if (err) {
                throw err;
            }
            const path = myID + "->" + chatid + "_" + Date.now();

            $.ajax({
                type: 'post',
                url: '../php/save_image.php',
                data: { path: path },
                success: function (data) {
                    saveMessage(path, 'image', myID, chatid);
                },
                error: function () {

                }
            });
            return false;
        });
    }
}

