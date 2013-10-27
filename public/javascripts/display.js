$(function() {
    var socket = io.connect('http://localhost:3000');
    socket.on('valueChange', function (data) {
        $('#device1').html(data);
    });

    $('#button').on('click', function(){
        var value = $('#value').val()
        socket.emit('valueUpdate', value);
    });
});
