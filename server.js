const express = require('express');
const socket = require('socket.io');
const app = express();
const path = require('path');

let tasks = [];

app.use(express.static(path.join(__dirname + '/client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client, id: ' + socket.id);
  
  socket.on('updateTask', (tasks) => {
    //tasks.push(task);
    socket.broadcast.emit('updateTask', tasks);
  });
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  
  socket.on('removeTask', (id) => {
    tasks.filter(task => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use( (req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
