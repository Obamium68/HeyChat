const socket = new WebSocket('ws://localhost:8080');            //connection to the server
socket.onopen = () => {
    sendData();                //when connecting to the server send needed data to be acknowledged
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        // If server, by protocol, is sending you the list of online hosts set the online flag on all your online contacts
        case 'хозяева':
            let contactList = document.getElementsByClassName("chat");
            try {
                setTimeout(function () {
                    for (var i = 0; i < contactList.length; ++i) {
                        let currentDiv = contactList[i].getElementsByClassName('nickname');
                        let currentUsername = 'nobody';
                        if (currentDiv.length) {
                            currentUsername = currentDiv[0].innerHTML.substring(1,);
                        }

                        if (data.message.includes(currentUsername)) {
                            let state = contactList[i].querySelector('.point-state-offline');
                            state.classList.remove('point-state-offline');
                            state.classList.add('point-state-online');
                        } else {
                            let state = contactList[i].querySelector('.point-state-online');
                            if (state) {
                                state.classList.remove('point-state-online');
                                state.classList.add('point-state-offline');
                            }

                        }

                        //Se l'utente cambia stato mentre ho la chat aperta, aggiorno anche lo stato nel div in alto
                        if ($('div.chat[data-id="' + openChat + '"] .dataGroup .dati .nickname').html() == "@" + currentUsername) {
                            renderChat(openChat);
                        }
                    }
                }, 250);
            } catch (err) { console.log(err) }
            break;
        //If you have received a text message, append it if the chat is opened. Otherwise, throw a notification
        case 'text':
            if (openChat == data.chat) {
                appendMessage('', data.message, new Date().toLocaleString('sv-SE').replace(/\s/g, ' '), data.from);
                $("#messages").resize();
                $("#messages").scrollTop($("#messages")[0].scrollHeight);
            } else {
                const pallino = $('div.chat[data-id="' + data.chat + '"] .state > div');
                let nMssgs = pallino.html();
                if (nMssgs == "") nMssgs = 0;
                else nMssgs = parseInt(nMssgs);
                nMssgs++;
                pallino.html("" + nMssgs);
                pallino.addClass("newMessages");
            }
            break;
        //If you have received an image, render and append it if the chat is opened. Otherwise, throw a notification
        case 'image':
            if (openChat == data.chat) {
                appendImage('', "http://localhost/HeyChat/img/data/chats/" + data.message + ".png", new Date().toLocaleString('sv-SE').replace(/\s/g, ' '), data.from);
                setTimeout(function () {
                    $("#messages").resize();
                    $("#messages").scrollTop($("#messages")[0].scrollHeight);
                }, 100);
            } else {
                const pallino = $('div.chat[data-id="' + data.chat + '"] .state > div');
                let nMssgs = pallino.html();
                if (nMssgs == "") nMssgs = 0;
                else nMssgs = parseInt(nMssgs);
                nMssgs++;
                pallino.html("" + nMssgs);
                pallino.addClass("newMessages");
            }
            break;
    }
}

/**Format the text message to be sent
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
 * Send your data to be acknowledged
 */
function sendData() {
    socket.send(JSON.stringify(formatMessage(myID, 'text', 'online', "server")));
}

/**
 * Takes the input message in #textMessage and the receiver in #chat.attr(data-chatid) send data and return data to be saved
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
 * send the image loaded from the input form and save it
 * @returns null if not image loaded
 */
function sendImage() {
    const file = document.getElementById('inserisciImg').files[0];
    const chatid = $("#chat").attr("data-chatid");
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

        const path = myID + "to" + chatid + "_" + Date.now();

        $.ajax({
            type: "POST",
            url: "../php/save_image.php",
            data: { image: reader.result, name: path },
            success: function (response) {
                saveMessage(path, 'image', myID, chatid);

                socket.send(JSON.stringify(formatMessage(myID, 'image', path, chatid)))

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Foto inviata'
                })

            },
            error: function (xhr, status, error) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'error',
                    title: 'Errore nel salvataggio sul server'
                })
            }
        });
        return false;
    }
    chiudiBoxSendImage();
}

