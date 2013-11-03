$(function() {
    const DESTINATION = 'http://localhost:3000';
    // const DESTINATION = 'http://aegis-server.herokuapp.com';
    const COLOR_OK = '#33FF00';
    const COLOR_WARNING = '#FFFF00';
    const COLOR_CRITICAL = '#F83738';
    const COLOR_RIGHT = '#EEEEEC';
    const COLOR_LEFT = '#1C2534';
    //const COLOR_LEFT = '#051534';

    var socket = io.connect(DESTINATION);
    socket.on('connect', function(){
        socket.on('init', function (message) {
            console.log('init');
            updateValues(message);
        });
        socket.on('update', function (message) {
            console.log('Receive: ' + message);
            updateValues(message);
        });
    });

    function updateValues(message) {
        var json, device1, device2;
        try {
            json = JSON.parse(message);
        } catch(e) {
            console.log(e);
            return;
        }
        var value1 = json.device1;
        var value2 = json.device2;

        $('#value1').html(value1);
        $('#value2').html(value2);
        $('#range').val(value2);

        d3.select('#device1').style("fill", COLOR_LEFT);
        d3.select('#device2').style("fill", COLOR_RIGHT);

        // text1.style("fill", "blue");
    }

    $('#range').on('change', function(){
        var value = $('#range').val()
        // idはダミー
        var message = '{ "id": "device2", "value": ' + value + ' }';
        socket.emit('change', message);
//        changeCircleColor('device2', value);
    });

//----------------------------------------------------------------------//

    // Bubble chart

    var diameter = 960,
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

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.json("javascripts/data.json", function(error, root) {
        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
            .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            .attr("transform", function(d) { return "translate(" + d.x + "," + 250 + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("cy", 20)
            .attr("r", function(d) { return d.r; })
            .attr("id", function(d) { return d.className.substring(0, d.r / 3); })
            .style("fill", "white");

        node.append("text")
            .attr("id", function(d) { return d.className.substring(0, d.r / 3); })
            .style("font-size", "60")
            .style("text-anchor", "middle")
            .style("fill", "gray")
            //.style("font-color", function(d) { return d.fontColor; })
            .text(function(d) { return d.className.substring(0, d.r / 3); });
    });

    d3.select(self.frameElement).style("height", diameter + "px");

    function changeCircleColor(id, value) {
        var color;
        if (70 < value) {
           color = COLOR_OK;
        } else if (30 < value) {
           color = COLOR_WARNING;
        } else {
           color = COLOR_CRITICAL;
        }
        d3.select('#' + id).style("fill", color);
    }
});
