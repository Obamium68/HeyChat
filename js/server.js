
class User {
  constructor(name, surname, username, id, online, LastAccess, pwd) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.id = id;
    this.online = online;
    this.LastAccess = LastAccess;
    this.pwd = pwd;
  }

  //send clients their id
  notifyID() {
    clients.get(this.id).send(JSON.stringify({ message: this.id, from: 'كنية' }))
  }
}
/** Return the user having the connection ID
 * 
 * @param {*} id 
 */
function getUserByID(id) {
  connected.forEach(user => {
    try {
      if (user.id == id) return user;
    } catch (error) {
      return null;
    }
  });
}

/** Fetch all the user signed in 
 * 
 * @returns 
 */
async function fetchData() {
  try {
    const response = await fetch('http://localhost/heychat/php/get_all_users.php');
    const data = await response.json();
    data.forEach(dat => {
      users.push(dat.Username);
    });
    return;
  } catch (error) {
    console.log(error);
  }
}


const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();
const connected = [];
const users = [];

fetchData().then(() => startServer());
function startServer() {
  console.log('Server Started at ' + new Date(Date.now()));
  server.on('connection', (socket) => {
    const id = Date.now().toString();     //  Client id actually is timestamp of its start connection 
    let tempUser = new User("TempName", "TempSurname", "TempUser" + Math.floor(Math.random() * 100), id)    //  Create new user object using its info
    clients.set(id, socket);              //  Link user to ws connection
    connected.push(tempUser);


    socket.on('message', (message) => {
      const data = JSON.parse(message);

      const fromSocket = clients.get(data.from);    // Get sender ws from its id
      const toSocket = clients.get(data.to);        // Get receiver ws from its id

      errormsg = "[Error] Client not found";

      switch (true) {
        case toSocket != null:        // If receiver ws exists
          toSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));       // Send the message
          if (fromSocket != toSocket) fromSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));   // If I'm not sending the message to myself resend the message to me
          break;
        case data.to && toSocket == null:   // If the user gave in input the receiver but it doesnt exists
          fromSocket.send(JSON.stringify({ from: id, message: errormsg, type: 'error' }));   // Throw an error message to the sender
          break;
        case toSocket == fromSocket:    //If sender and receiver coincide set the username sent in the message
        /**Define user */
      }
    });

    socket.on('close', () => {
      clients.delete(id);
      console.log(`Client ${id} disconnected`);
    });
  });
}