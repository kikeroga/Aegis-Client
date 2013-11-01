$(function() {
    const DESTINATION = 'http://localhost:3000';
    // const DESTINATION = 'http://aegis-server.herokuapp.com';
    
    var socket = io.connect(DESTINATION);
    socket.on('connect', function(){
        socket.on('init', function (value) {
            console.log('init');
            $('#device1').html(value);
            $('#range').val(value);
            drawCircle(value);
        });
        socket.on('update', function (value) {
            console.log('Receive: ' + value);
            $('#device1').html(value);
            //$('#range').value(value);
            $('#range').val(value);
            drawCircle(value);
        });
    });

    $('#range').on('change', function(){
        var value = $('#range').val()
        socket.emit('change', value);
        console.log('Send: ' + value);
        drawCircle(value);
    });


    // Bubble

    //var diameter = 960,
    var diameter = 320,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);
 
    var svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var circle = svg.append("circle")
        .attr("cx",100)
        .attr("cy",100)
        .attr("fill","red");

    function drawCircle(value) {
        circle.attr("r", value);
    }
});
