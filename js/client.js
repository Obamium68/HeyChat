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
function startChat(receiver) {
    if (receiver) {
        let ids = [];
        $.post('../php/get_id_from_username.php', { username: me }, function (response) {
            ids[0] = JSON.parse(response)['Id'];
            $.post('../php/get_id_from_username.php', { username: receiver }, function (response) {
                ids[1] = JSON.parse(response)['Id'];
                saveChat(ids[0], ids[1], me + "ラネラ" + receiver);
            });
        });
        //**!!!!!!!Gianlù qui vanno le tue cose di rendering :)!!!!!!!*/
    }
}

function loadChats() {
    $.post('../php/get_id_from_username.php', { username: myUsername }, function (response) {
        let myID = JSON.parse(response)['Id'];
        $.post('../php/get_chats.php', { myID: myID }, function (response) {
            console.log(JSON.parse(response));
        });
    });
}

/** Takes the following parameters and 
 * 
 * @param {*} ownerID chat's owner ID
 * @param {*} receiverID other chat partecipant ID
 * @param {*} chatName chat name
 */
function saveChat(ownerID, receiverID, chatName) {
    $.post('../php/create_chat.php', { participants: 2, ownerId: ownerID, receiverID: receiverID, chatName: chatName }, function (response) {
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


