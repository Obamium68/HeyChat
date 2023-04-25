/**
 * Class User represetn
 */
class User {
  constructor(username, id, online) {
    this.username = username;
    this.id = id;
    this.online = online;
  }
}

class Chat {
  constructor(chatID, participations) {
    this.chatID = chatID;
    this.participations = [];
    this.participations.push(participations);
  }

  setChatID(cID) {
    this.chatID = cID;
  }

  addPartecipant(part) {
    this.participations.push(part);
  }
}

/** Return the user having the ID
 * 
 * @param {*} id 
 */
function getUserFromID(id) {
  let toReturn;
  Array.from(clients.keys()).forEach((user) => {
    if (user.id == id) toReturn = user;
  });
  return toReturn;
}

/** Fetch all the user signed in 
 * 
 * @returns 
 */
async function fetchDataAndStartServer() {
  try {
    //const path = 'http://localhost/GitHub/HeyChat/php/get_all_users.php';
    const path = 'http://localhost/heychat/php/get_all_users.php';
    const responseUsers = await fetch(path);
    const users = await responseUsers.json();
    const responseParticipations = await fetch('http://localhost/heychat/php/get_all_participations.php');
    //const responseParticipations = await fetch('http://localhost/GitHub/HeyChat/php/get_all_participations.php');
    const participations = await responseParticipations.json();
    users.forEach(user => {
      clients.set(new User(user.Username, user.Id, false), null);
    });
    updateChats(participations);
    startServer();
  } catch (error) {
    console.log(error);
  }
}


const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();    //Links users to the socket they're connected on
const chats = []; //list of chats

fetchDataAndStartServer();


function startServer() {
  console.log('Server Started at ' + new Date(Date.now()));
  server.on('connection', (socket) => {
    console.log(`[@${Date.now()}] someone connected`);
    socket.on('message', (message) => {
      const data = JSON.parse(message);
      let senderID = data.from;
      console.log(senderID);
      let senderUser = getUserFromID(senderID);
      let receivers = null;
      let foundReceivers = false;
      chats.forEach(chat => {
        if (chat.chatID == data.to) {
          receivers = chat.participations;
          foundReceivers = true;
        }
      });

      switch (true) {
        case data.to == 'server' && data.message == 'online':
          senderUser.online = true;
          clients.set(senderUser, socket);
          notifyOnline();
          break;
        case !foundReceivers:
          clients.get(senderUser).send(JSON.stringify({ from: 'server', message: 'Error, client not found', type: 'error' }));   // Throw an error message to the sender
          break;
        case foundReceivers:
          receivers.forEach(receiver => {
            try {
              clients.get(getUserFromID(receiver)).send(JSON.stringify({ chat: data.to, from: data.from, message: data.message, type: data.type }));
            } catch (err) {

            }
          });
          break;
        case foundReceivers && data.type == 'text':
          console.log(data);
          break;
      }
    });

    socket.on('close', () => {
      let disconnectingUser = getByValue(clients, socket);
      disconnectingUser.online = false;
      clients.set(disconnectingUser, null);
      notifyOnline();
      console.log(disconnectingUser.username + " disconnected from the server");
    });
  });
}

/** Returns key from value
 * 
 * @param {Map} map map to extract data
 * @param {socket} searchValue value to search
 * @returns 
 */
function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}
//**Returns all online user connected to the server */
function getOnlineUsers() {
  let users = [];
  Array.from(clients.keys()).forEach((user) => {
    if (user.online) users.push(user);
  });
  return users;
}

/**
 * Sends the list of online users chat to all online users
 */
function notifyOnline() {
  const onlineUsers = getOnlineUsers();
  const onlineUsersUsernames = [];
  onlineUsers.forEach(user => {
    onlineUsersUsernames.push(user.username);
  });
  onlineUsers.forEach(onlineUser => {
    clients.get(onlineUser).send(JSON.stringify({ from: 'server', message: onlineUsersUsernames, type: 'хозяева' }));
  });
}

/*
CODICE MENO OTTIMIZZATO AL MONDO PER AVERE
chats = [
  { chadID: n0, participations: [p01, p02, p03] },
  { chadID: n1, participations: [p11, p12, p13] },
  ...
]
*/
function updateChats(participations) {
  participations.forEach(participation => {
    let added = false;
    chats.forEach(chat => {
      if (chat.chatID == participation.ChatID) {
        chat.addPartecipant(participation.UserID);
        added = true;
      }
    });
    if (!added) chats.push(new Chat(participation.ChatID, participation.UserID));
  });
}