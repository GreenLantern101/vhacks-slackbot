'use strict';

// declare modules to use
var express = require('express'),
    app = express(),
    server = require('http').Server(app);

var Message = require('./models/message.js');

// set up Slackbot
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));

// create SlackBot
var SlackBot = require('slackbots');
var bot = new SlackBot({
    token: config.token,
    name: config.name
});

// create params object
var params = {
    reply_broadcast: 'false'
};

// on creation
bot.on('start', function() {
    console.log("Bot starting in channel: " + config.channel);
});

// on posted message
bot.on('message', function(data) {
    // only handle valid messages directed at the bot
    if (!data.user || !data.text || !data.text.includes("<@U4VTCUZ6U>")) {
        return;
    }

    // remove mention text
    var feedback = data.text.replace(/<@U4VTCUZ6U>/g, '');

    // extract user and channel
    var user = find(bot.getUsers()._value.members, 'id', data.user);
    var channel = find(bot.getChannels()._value.channels, 'id', data.channel);

    // log feedback in console
    console.log("In " + channel.name + ", " + user.name + " says: " + data.text);

    // thank user (both in channel and directly) for feedback
    bot.postMessageToChannel(config.channel,
        "Thanks for your feedback, " + user.name + "!",
        params);
    bot.postMessageToUser(user.name, "Feedback submitted:\n" + "\"" + feedback + "\"", params);

    // TODO: forward feedback to private channel
    // TODO: add message to MongoDB
    // TODO: Integrate Primus
});

// returns 1st value that matches
function find(arr, field, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][field] === value) {
            return arr[i];
        }
    }
    return undefined;
}
