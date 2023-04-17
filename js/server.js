class User {
  constructor(username, id, online) {
    this.username = username;
    this.id = id;
    this.online = online;
  }

}
/** Return the user having the connection ID
 * 
 * @param {*} id 
 */
function getUserFromUsername(usern) {
  let toReturn;
  Array.from(clients.keys()).forEach((user) => {
    if (user.username == usern) toReturn = user;
  });
  return toReturn;
}

/** Fetch all the user signed in 
 * 
 * @returns 
 */
async function fetchDataAndStartServer() {
  try {
    const response = await fetch('http://localhost/heychat/php/get_all_users.php');
    const data = await response.json();
    data.forEach(dat => {
      clients.set(new User(dat.Username, null, false), null);
    });
    startServer();
  } catch (error) {
    console.log(error);
  }
}



const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();    //Links users to the socket they're connected on

fetchDataAndStartServer();


function startServer() {
  console.log('Server Started at ' + new Date(Date.now()));
  server.on('connection', (socket) => {
    console.log(`[@${Date.now()}] someone connected`);

    socket.on('message', (message) => {
      const data = JSON.parse(message);

      const fromSocket = clients.get(getUserFromUsername(data.from));    // Get sender ws from its id
      const toSocket = clients.get(getUserFromUsername(data.to));        // Get receiver ws from its id

      errormsg = "[Error] Client not found";

      switch (true) {
        case data.from == data.to:
          let current = getUserFromUsername(data.message.split('~')[0]);
          current.id = data.message.split('~')[1];
          current.online = true;
          clients.set(current, socket);    //LOG USER
          console.log(getOnlineUsers());
          break;
        case toSocket != null:        // If receiver ws exists
          toSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));       // Send the message
          if (fromSocket != toSocket) fromSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));   // If I'm not sending the message to myself resend the message to me
          break;
        case data.to && toSocket == null:   // If the user gave in input the receiver but it doesnt exists
          fromSocket.send(JSON.stringify({ from: id, message: errormsg, type: 'error' }));   // Throw an error message to the sender
          break;
        case toSocket == fromSocket:    //If sender and receiver coincide set the user
          clients.set(getUserFromUsername(data.from), socket);
          break;
        default:
          console.log(getOnlineUsers());
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