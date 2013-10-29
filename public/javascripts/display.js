$(function() {
    // var socket = io.connect('http://localhost:3000');
    var socket = io.connect('http://aegis-server.herokuapp.com');
    socket.on('connect', function(){
        socket.on('update', function (value) {
            console.log('Receive: ' + value);
            $('#device1').html(value);
        });
    });

    $('#button').on('click', function(){
        var value = $('#value').val()
        socket.emit('change', value);
        console.log('Send: ' + value);
    });
});
