//**IN THIS FILE IS STORED THE CODE NEEDED TO INTERFACE WITH THE SERVER     -Loaded in chat.php*/
const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
    sendData();
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    switch (data.type) {
        case 'хозяева':          // If server is sending you the connected hosts
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
        case 'text':
            if(openChat == data.chat){
                appendMessage(data.message, new Date().toLocaleString('sv-SE').replace(/\s/g, ' '), data.from);
                $("#messages").resize();
                $("#messages").scrollTop($("#messages")[0].scrollHeight);
            }else{
                const pallino = $('div.chat[data-id="' + data.chat+'"] .state > div');
                let nMssgs = pallino.html();
                if(nMssgs=="") nMssgs=0;
                else nMssgs=parseInt(nMssgs);
                nMssgs++;
                pallino.html(""+nMssgs);
                pallino.addClass("newMessages");
            }
            break;
        case 'image':
            if(openChat == data.chat){
                appendImage("http://localhost/GitHub/HeyChat/img/data/chats/"+data.message+".png", new Date().toLocaleString('sv-SE').replace(/\s/g, ' '), data.from);
                setTimeout(function () {
                    $("#messages").resize();
                    $("#messages").scrollTop($("#messages")[0].scrollHeight);
                },100);
            }else{
                const pallino = $('div.chat[data-id="' + data.chat+'"] .state > div');
                let nMssgs = pallino.html();
                if(nMssgs=="") nMssgs=0;
                else nMssgs=parseInt(nMssgs);
                nMssgs++;
                pallino.html(""+nMssgs);
                pallino.addClass("newMessages");
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
function sendImage() {
    const file = document.getElementById('inserisciImg').files[0];
    console.log('in');
    const chatid = $("#chat").attr("data-chatid");
    if (!file) {
        //TO-DO Gianluca gestisci errore :)
        //È impossiblie che si verifichi perchè se nessun file è caricato il tasto invia non è mostrato all'utente
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        
        const path = myID + "to" + chatid + "_" + Date.now();
        console.log(path);

        $.ajax({
            type: "POST",
            url: "../php/save_image.php",
            data: { image: reader.result, name: path },
            success: function(response) {
                console.log(response);
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
            error: function(xhr, status, error) {
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

