const express = require('express');
const app = express();
const cors = require('cors');

// enable cors
app.use(cors());

// set the template engine js
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    // res.send('Hello world');
    res.render('index');
});

// listen on port 3000
server = app.listen(3000);

// socket.io instantiation
const io = require('socket.io')(server);

// listen on every connection
io.on('connection', (socket) => {
    socket.broadcast.emit('new_connection');

    //default username
    socket.username = "Anonymous";

    // listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    // listen on new_message
    socket.on('new_message', (data) => {
        // broadcast new message
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username
        });
    });

    // listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // listen on stop typing
    socket.on('stop_typing', (data) => {
        socket.broadcast.emit('stop_typing');
    });
});