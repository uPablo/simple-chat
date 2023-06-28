$(function(){

    function getCurrentURL() {
        return window.location.href
    }

    // make connection
    var socket = io.connect(getCurrentURL());

    // buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var button_send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var message = $("#message");
    var feedback = $("#feedback")

    function change_username() {
        socket.emit('change_username', {
            username: username.val()
        });
        username.val("");
    }

    // Emit a username
    send_username.click(function(){
        change_username();
    });

    // Change username when press enter and the input username is not empty
    $(username).on('keypress', function (e) {
        if(username.val().length > 0 && e.which == 13) {
            change_username();
        }
    });

    function send_message() {
        socket.emit('new_message', {
            message: message.val()
        });
        message.val("");
    }

    // Emit message
    button_send_message.click(function(){
        send_message();
    });

    // Send message when press enter and the input message is not empty
    $(message).on('keypress', function (e) {
        if(message.val().length > 0 && e.which == 13) {
            send_message();
        }
    });

    socket.on('new_message', (data) => {
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>");
    });

    // Emit typing
    $(message).keypress(function(){
        socket.emit('typing');
    });

    function delay(callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }
    // Emit typing
    $(message).keyup(delay(function (e) {
        socket.emit('stop_typing');
    }, 1000));

    // show who is typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message...</i></p>");
    });

    // stop show who is typing
    socket.on('stop_typing', () => {
        feedback.html("<p><i>nothing to see here</i></p>");
    });

    socket.on('new_connection', () => {
        chatroom.append("<p class='message'>New user has connected in this room</p>");
    });

});