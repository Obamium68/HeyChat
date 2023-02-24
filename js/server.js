const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const debug=true;

class User {
  constructor(name, surname, username, id, online, LastAccess, pwd) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.id = id;
    this.online = online;
    this.LastAccess=LastAccess;
    this.pwd = pwd;
  }
  
  toString(){
    return this.id;
  }
  notifyID() {
    clients.get(this.id).send(JSON.stringify({ message: this.id, from: 'كنية' }))
  }
}

// We'll use a Map to keep track of connected clients
const clients = new Map();
var users = [];

function getUserFromUsername(un){
  users.forEach(u => {
    if(u.username==un) return u;
  });
}

server.on('connection', (socket) => {
  const id = Date.now().toString();     //  Client id actually is timestamp of its start connection 
  clients.set(id, socket);              //  Link id to ws connection
  users.push(
    new User("Mario", "Rossi", "MarioRossi" + Math.floor(Math.random() * 100), id)    //  Create new user object using its info
  )
  users[users.length - 1].notifyID();   //  ACK clients of its ID
  if(debug) console.log(`[${Date.now()}]:(${users[users.length - 1].username}:${users[users.length - 1].id}) connected`);    //Log message


  socket.on('message', (message) => {
    const data = JSON.parse(message);
    if(debug) console.log(data);
    
    const fromSocket = clients.get(data.from);    // Get sender ws from its id
    const toSocket = clients.get(data.to);        // Get receiver ws from its id

    errormsg = "[Error] Client not found";
    
    switch (true) {
      case toSocket != null:        // If receiver ws exists
        toSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));       // Send the message
        if(fromSocket!=toSocket) fromSocket.send(JSON.stringify({ from: id,  message: data.message, type: data.type}));   // If I'm not sending the message to myself resend the message to me
        break;
      case data.to && toSocket == null:   // If the user gave in input the receiver but it doesnt exists
        fromSocket.send(JSON.stringify({ from: id, message: errormsg, type: 'error'}));   // Throw an error message to the sender
        break;
    }
  });

  socket.on('close', () => {
    clients.delete(id);
    console.log(`Client ${id} disconnected`);
  });
});