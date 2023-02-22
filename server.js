const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

class User {
  constructor(name, surname, username, id) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.id = id;
  }
  notifyID() {
    clients.get(this.id).send(JSON.stringify({ from: this.id, message: "الأسود أسود" }))
  }
}

// We'll use a Map to keep track of connected clients
const clients = new Map();
var users = [];
//LANERAE

server.on('connection', (socket) => {
  // Generate a unique id for the client
  const id = Date.now().toString();

  // Add the new client to the clients Map
  clients.set(id, socket);

  users.push(
    new User("Mario", "Rossi", "MarioRossi" + Math.floor(Math.random() * 100), id)
  )
  users[users.length - 1].notifyID();

  console.log(`Client [${users[users.length - 1].username}:${users[users.length - 1].id}] connected`);

  socket.on('message', (message) => {
    // Parse the message as JSON
    const data = JSON.parse(message);
    console.log(data);
    // Send the message to a specific client
    const fromSocket = clients.get(data.from);
    const toSocket = clients.get(data.to);

    errormsg = "[Error] Client not found";
    
    switch (true) {
      case toSocket != null:
        toSocket.send(JSON.stringify({ from: id, message: data.message, type: data.type }));
        if(fromSocket!=toSocket) fromSocket.send(JSON.stringify({ from: id,  message: data.message, type: data.type}));
        break;
      case data.to && toSocket == null:
        fromSocket.send(JSON.stringify({ from: id, message: errormsg, type: 'error'}));
        break;
    }
  });

  socket.on('close', () => {
    clients.delete(id);
    console.log(`Client ${id} disconnected`);
  });
});