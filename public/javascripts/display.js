$(function() {
    const DESTINATION = 'http://localhost:3000';
    // const DESTINATION = 'http://aegis-server.herokuapp.com';
    const COLOR_OK = '#33FF00';
    const COLOR_WARNING = '#FFFF00';
    const COLOR_CRITICAL = '#F83738';
    
    var socket = io.connect(DESTINATION);
    socket.on('connect', function(){
        socket.on('init', function (value) {
            console.log('init');
            $('#value1').html(value);
            $('#range').val(value);
            drawDevice1Circle(value);
        });
        socket.on('update', function (value) {
            console.log('Receive: ' + value);
            $('#value1').html(value);
            $('#range').val(value);
            drawDevice1Circle(value);
        });
    });

    $('#range').on('change', function(){
        var value = $('#range').val()
        socket.emit('change', value);
        drawDevice1Circle(value);
    });

//----------------------------------------------------------------------//

    // Bubble chart

    var diameter = 320,
    //var diameter = 960,
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
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            //.attr("id", "device1")
            .attr("id", function(d) { return d.className.substring(0, d.r / 3); })
            .style("fill", COLOR_OK);

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            //.style("fill", "white")
            .text(function(d) { return d.className.substring(0, d.r / 3); });
    });

    d3.select(self.frameElement).style("height", diameter + "px");

    function drawDevice1Circle(value) {
        var color;
        if (70 < value) {
           color = COLOR_OK;
        } else if (30 < value) {
           color = COLOR_WARNING;
        } else {
           color = COLOR_CRITICAL;
        }
        d3.select('#device1').style("fill", color);
    }
});
