require('dotenv').config();

const express = require('express');
const app = express();


// Import the HTTP and the CORS library to allow 
// data transfer between the client and the server domains
const cors = require('cors');
app.use(cors());
app.use(express.json());

const http = require('http').Server(app);


const PORT = 4000 || process.env.PORT ;


// add Socket.io to the project to create a real-time connection.
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "https://chatroom-client-silk.vercel.app"
        
    }
});

let users = []

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`)  

    socket.on("message", data => {
        console.log(data);
      socketIO.emit("messageResponse", data)
    })
    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
    

     //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
    console.log(users);
  });
 
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      socketIO.emit("newUserResponse", users)
      socket.disconnect()
    });
});

http.listen(PORT, () => {
    console.log(`ChatRoom Server is Live at port:${PORT} and waiting`);
});
app.get('/', (request, response) => {
    response.send(`<h1>ChatRoom Server is Started running at Port number ${PORT}</h1>`);
});
