'use strict';

var express = require('express'),
    app = express(),
    server = require('http').Server(app);


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
    // 1. Handle received message
    console.log("In " + data.channel + ", " + data.user + " says: " + data.text);
    //thank user for feedback
    bot.postMessageToChannel(data.channel, 'Thanks for your feedback.', params);
    //forward message to private group
    bot.postMessageToChannel(config.channel,
        "In " + data.channel + ", " + data.user + " says: " + data.text, params);
    // 2. add message to MongoDB


    // 3. send via Primus to front-end json data page


});

function getMessages() {

}
