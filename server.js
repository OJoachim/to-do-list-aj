const express = require('express');
const socket = require('socket.io');
const app = express();
const path = require('path');

const tasks = [];

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
  socket.emit('updateTask', tasks);
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  
  socket.on('removeTask', (id) => {
    const taskToRemove = tasks.findIndex(task => task.id === id);
    tasks.splice(taskToRemove, 1);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use( (req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
