/**
 * Class User represents the users which interact with the server
 * it is described by an USERNAME, which is unique such as its ID.
 * The attribute online is managed as bool.
 */
class User {
  constructor(username, id, online) {
    this.username = username;
    this.id = id;
    this.online = online;
  }
}

/**
 * Class Chat is used to simplify management operations regarding message forwarding
 * on lines [184-195] is explained how is it used
 */
class Chat {
  constructor(chatID, participations) {
    this.chatID = chatID;
    this.participations = [];
    this.participations.push(participations);
  }

  /**Set the chat id
   * 
   * @param {int} cID chatID
   */
  setChatID(cID) {
    this.chatID = cID;
  }

  /** Add a participant into the chat
   * 
   * @param {int} part participant id 
   */
  addPartecipant(part) {
    this.participations.push(part);
  }
}

/** Return the user having the ID
 * 
 * @param {int} id id of the user to be returned
 */
function getUserFromID(id) {
  let toReturn;
  Array.from(clients.keys()).forEach((user) => {
    if (user.id == id) toReturn = user;
  });
  return toReturn;
}

/** Fetch asynchronously the users and the participations to chat
 * add the users to the clients list (mapped with the socket they will be connected on)
 * Starts server
 * 
 * @returns 
 */
async function fetchDataAndStartServer() {
  try {
    const path = 'http://localhost/heychat/php/';
    const responseUsers = await fetch(path + 'get_all_users.php');
    const users = await responseUsers.json();
    const responseParticipations = await fetch(path + 'get_all_participations.php');
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


const WebSocket = require('ws');      //Importing WebSocket
const server = new WebSocket.Server({ port: 8080 });    //Port on which the server will work
const clients = new Map();             //A map to keep track of users and their connection sockets
const chats = [];                     //list of chats
fetchDataAndStartServer();


/**
 * Main function of the ws server. It starts the service
 */
function startServer() {
  console.log('Server Started at ' + new Date(Date.now()));
  server.on('connection', (socket) => {
    console.log(`[@${Date.now()}] someone connected`);
    socket.on('message', (message) => {           //When a message is sent by a client
      const data = JSON.parse(message);           //Extract it from JSON format
      console.log(`[@${Date.now()}] message sent:`);
      console.log(data);
      let senderID = data.from;                   //Get the senderID
      let senderUser = getUserFromID(senderID);   //Get the sender user
      let receivers = null;                       //Define the var that will store the receivers
      let foundReceivers = false;
      chats.forEach(chat => {                     //Find the users related to the chat id and store them in array receivers
        if (chat.chatID == data.to) {
          receivers = chat.participations;
          foundReceivers = true;
        }
      });

      switch (true) {
        //If, by protocol, the user is sending 'online' to 'server' the client is sending his data to be acknowledged by the server
        case data.to == 'server' && data.message == 'online':
          senderUser.online = true;
          clients.set(senderUser, socket);
          notifyOnline();
          console.log(`[@${Date.now()}] '` + senderUser.username + "' authenticated");
          break;
        //If no receivers are found, send an error message to the client
        case !foundReceivers:
          clients.get(senderUser).send(JSON.stringify({ from: 'server', message: 'Error, client not found', type: 'error' }));   // Throw an error message to the sender
          break;
        //If receivers are found, send the message to each of them
        case foundReceivers:
          receivers.forEach(receiver => {
            try {
              clients.get(getUserFromID(receiver)).send(JSON.stringify({ chat: data.to, from: data.from, message: data.message, type: data.type }));
            } catch (err) {
              console.log(err);
            }
          });
          break;
      }
    });

    //if someone having socket as socket connections close interaction with server
    socket.on('close', () => {
      let disconnectingUser = getByValue(clients, socket);    //get the user that is disconnecting
      disconnectingUser.online = false;       //set offline
      clients.set(disconnectingUser, null);   //remove its connection link
      notifyOnline();                         //notify all of the changes
      console.log(`[@${Date.now()}] '` + disconnectingUser.username + "' disconnected");
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

/**Returns all online user connected to the server */
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
Given the array:
participations = [
  { chatID: 0, UserID: 01 },
  { chatID: 0, UserID: 02 },
  { chatID: 0, UserID: 03 },
  { chatID: 1, UserID: 11 },
  { chatID: 1, UserID: 21 },
  { chatID: 2, UserID: 31 }
]
format it as
  chats =[
    { chadID: 0, participations: [01, 02, 03] },
    { chadID: 1, participations: [11, 12, 13] }
  ]
and update the chat list
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