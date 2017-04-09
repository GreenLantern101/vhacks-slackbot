'use strict';

var express = require('express'),
    app = express(),
    port = 8000,
    server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));
app.use(require('./controllers/dashboard.js'));

// create primus for sockets
var Primus = require('primus'),
    primus = new Primus(server, {
        transformer: 'sockjs',
        parser: 'JSON'
    });


//load config file for Slackbot
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));

// make client-side primus lib, if it doesn't already exist
fs.stat('./public/primus.js', function(err, stats) {
    //Check if error defined and the error code is "not exists"
    if (err == null) {
        console.log('***Primus.js client lib exists.');
    } else {
        //Create the directory, call the callback.
        // save client-side lib, regenerate each time recommended
        primus.save(__dirname + '/public/primus.js');
        console.log('***New client-side Primus lib generated.');

        //TODO: UGLIFY!!!
    }
});

// create SlackBot
var SlackBot = require('slackbots');
var bot = new SlackBot({
    // Add a bot https://my.slack.com/services/new/bot and put the token
    token: config.token,
    name: config.name
});



// more information about additional params https://api.slack.com/methods/chat.postMessage
var params = {
    reply_broadcast: 'false'
};

bot.on('start', function() {

    /* view all channels - for debugging
        var arr = bot.getChannels();
        console.log(JSON.stringify(arr));
    */

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    console.log("Bot starting in channel: " + config.channel);
    //greeting message
    //bot.postMessageToChannel(config.channel, 'Welcome!', params);

    // define existing username instead of 'user_name'
    //bot.postMessageToUser('user_name', 'Hello!', params);

});

bot.on('message', function(data) {
    // all incoming events https://api.slack.com/rtm
    if (!data.user || !data.text) {
        return;
    }
    // 1. log to console (temporary)
    console.log("In " + data.channel + ", " + data.user + " says: " + data.text);
    bot.postMessageToChannel(config.channel, 'Message received.', params);
    // 2. log to MongoDB


    // 3. send via Primus to front-end dashboard


});

server.listen(port, function() {
    console.log('Server started on port ' + port)
});

function getMessages() {

}
