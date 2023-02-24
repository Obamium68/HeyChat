const socket = new WebSocket('ws://localhost:8080');

var myID = "UNDEFINED69";

var connectedHosts = [];    //Host connected to the same server


socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    switch (true) {
        case data.from == 'كنية':             // If server is sending you your ID
            myID = data.message;              // Set your id
            document.getElementById('myID').innerHTML = myID;
            break;
        case data.from == 'хозяева':          // If server is sending you the connected hosts
            const hosts=data.message.split(',');
            connectedHosts=hosts;
            break;
        default:
            const messages = document.getElementById('messages');
            console.log(data);
            switch (data.type) {
                case 'text':
                    const li = document.createElement('li');
                    li.textContent = `${data.from == myID ? "You" : data.from}: ${data.message}`;
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

function sendMessage() {
    const to = document.getElementById('to').value;
    const message = document.getElementById('message').value;
    socket.send(JSON.stringify(formatMessage(myID, 'text', message, to)));
}


function sendImage() {
    const file = document.getElementById('file').files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const to = document.getElementById('to').value;
        socket.send(JSON.stringify(formatMessage(myID, 'image', reader.result, to)));
    };
}

