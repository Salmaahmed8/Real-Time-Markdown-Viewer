var express = require('express');
const sharejs = require('share');
require('redis');

var app = express();

// set the view ehgine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('pad');
});
app.get('/(:id)', function(req,res) {
    res.render('pad');
})

//setup redis server
var redisClient;
console.log(process.env.REDISTOGO_URL);
if(process.env.REDISTOGO_URL) {
    const rtg = require("url").parse(process.env.REDISTOGO_URL);
    redisClient = require("redis").createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(":")[1]);
} else{
    redisClient = require("redis").createClient();
}

//options for sharejs
var options = {
    db: { type: 'redis', client: redisClient }
};

//attach the express server to sharejs
sharejs.server.attach(app, options);

//handle a real-time communication with socket.IO
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for a 'message' event from the client
    socket.on('message', (data) => {
        console.log('Message received:', data);

        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Listen for a 'disconnect' event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


app.listen(process.env.PORT || 8000, () => {
    console.log(`Listening to port ${port}`);
});