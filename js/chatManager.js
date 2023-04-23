//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE SERVER     -Loaded in chat.php*/
const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
    sendData();
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (true) {
        case data.type == 'хозяева':          // If server is sending you the connected hosts
            let contactList = document.getElementsByClassName("chat");
            console.log(data.message);
            for (var i = 0; i < contactList.length; ++i) {
                if ((data.message).includes(contactList[i].getAttribute('data-id'))) {
                    let state=contactList[i].querySelector('.point-state-offline');
                    state.classList.remove("point-state-offline");
                    state.classList.add("point-state-online");
                }
            }
            break;
        default:
            const messages = document.getElementById('messages');       //TO-DO gestisci il render
            switch (data.type) {
                case 'text':
                    //**TODO GIANLUCA GESTISCI LA VISUALIZZAZIONE MESSAGGI. QUESTO DEVE ESSERE L'UNICA GESTIONE */
                    break;
                case 'image':
                    const img = document.createElement('img');
                    img.src = data.message;
                    messages.appendChild(img);
                    /**SEGUE QUI MA DEVO FINIRE IMPLEMENTAZIONE IMAGES */
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
            console.log(err);
        }
    });
    return [message, 'text', myID, chatid];
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

