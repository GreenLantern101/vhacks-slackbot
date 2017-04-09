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

var Message = require('./models/message.js');


//load config file for Slackbot
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));

fs.stat('./public/primus.min.js', function(err, stats) {
    //if file exists
    if (err == null) {
        console.log('***Primus.min.js client lib exists.');
    } else {
        // make client-side primus lib, if it doesn't already exist
        fs.stat('./primus.js', function(err2, stats2) {
            // file does not exist
            if (err2 != null) {
                //Create the directory, call the callback.
                // save client-side lib, regenerate each time recommended
                primus.save(__dirname + '/primus.js');
                console.log('***New client-side Primus lib generated.');
            }
            //minify
            var uglifyJS = require('uglify-js');
            var min = uglifyJS.minify('./primus.js', {
                mangle: true,
                compress: {
                    dead_code: true,
                    unused: true,
                    drop_console: true,
                    join_vars: true,
                    booleans: true,
                    loops: true
                }
            });
            fs.writeFile('./public/primus.min.js', min.code, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('***New client-side Primus lib minified.');
                }
            });
        });
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
    // 2. add to MongoDB


    // 3. send via Primus to front-end json data page


});

server.listen(port, function() {
    console.log('Server started on port ' + port)
});

function getMessages() {

}
