class User {
  constructor(username, id, online) {
    this.username = username;
    this.id = id;
    this.online = online;
  }

}
/** Return the user having the username
 * 
 * @param {String} usern 
 */
function getUserFromUsername(usern) {
  let toReturn;
  Array.from(clients.keys()).forEach((user) => {
    if (user.username == usern) toReturn = user;
  });
  return toReturn;
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
    const responseUsers = await fetch('http://localhost/heychat/php/get_all_users.php');
    console.log(responseUsers);
    const users = await responseUsers.json();
    const responseParticipations = await fetch('http://localhost/heychat/php/get_all_participations.php');
    console.log(responseParticipations);
    const participations = await responseParticipations.json();
    console.log(participations);
    users.forEach(user => {
      clients.set(new User(user.Username, user.Id, false), null);
    });
    participations.forEach(participation =>{
      
    });
    console.log(chats);
    startServer();
  } catch (error) {
    console.log("QUA");
    console.log(error);
  }
}



const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();    //Links users to the socket they're connected on
const chats = new Map();

fetchDataAndStartServer();


function startServer() {
  console.log('Server Started at ' + new Date(Date.now()));
  server.on('connection', (socket) => {
    console.log(`[@${Date.now()}] someone connected`);

    socket.on('message', (message) => {
      const data = JSON.parse(message);

      const fromSocket = clients.get(getUserFromID(data.from));    // Get sender ws from its id
      const toSocket = clients.get(getUserFromID(data.to));        // Get receiver ws from its id

      errormsg = "[Error] Client not found";

      let senderID = data.from;
      let senderUser = getUserFromID(senderID);

      switch (true) {
        case data.to == 'server' && data.message == 'online':
          senderUser.online = true;
          clients.set(senderUser, socket);
          break;
        case toSocket != null:        // If receiver ws exists
          toSocket.send(JSON.stringify({ from: senderID, message: data.message, type: data.type }));       // Send the message
          if (fromSocket != toSocket) fromSocket.send(JSON.stringify({ from: senderID, message: data.message, type: data.type }));   // If I'm not sending the message to myself resend the message to me
          break;
        case data.to && toSocket == null:   // If the user gave in input the receiver but it doesnt exists
          fromSocket.send(JSON.stringify({ from: id, message: errormsg, type: 'error' }));   // Throw an error message to the sender
          break;
      }
    });

    socket.on('close', () => {
      let disconnectingUser = getByValue(clients, socket);
      disconnectingUser.online = false;
      clients.set(disconnectingUser, null);
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