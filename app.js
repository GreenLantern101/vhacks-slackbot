'use strict';

// declare modules to use
var express = require('express'),
    app = express(),
    server = require('http').Server(app);

var Message = require('./models/message.js');

// set up Slackbot
var fs = require('fs');

// create SlackBot
var SlackBot = require('slackbots');
var bot = new SlackBot({
    token: process.env.token,
    name: process.env.name
});

// create params object
var params = {
    reply_broadcast: 'false'
};

// on creation
bot.on('start', function() {
    console.log("Bot starting in channel: " + process.env.channel);
});

// on posted message
bot.on('message', function(data) {
    // only handle valid messages directed at the bot
    if (!data.user || !data.text || !data.text.includes("<@U4VTCUZ6U>")) {
        return;
    }

    // remove mention text
    var feedback = data.text.replace(/<@U4VTCUZ6U>/g, '').trim();

    // extract user and channel
    var user = find(bot.getUsers()._value.members, 'id', data.user);
    var channel = find(bot.getChannels()._value.channels, 'id', data.channel);

    // log feedback in console
    // console.log("In " + channel.name + ", " + user.name + " says: " + data.text);

    // thank user in channel for feedback
    bot.postMessageToChannel(process.env.channel,
        "Thanks for your feedback, " + user.name + "!",
        params);

    /* fast check to see if invalid input
    * invalid if <=5 non-whitespace chars
    */
    if(feedback.replace(/\s/g,'').length<=5){
        // if invalid, don't forward or save to db
        return;
    }

    // forward feedback to private group
    bot.postMessageToGroup(process.env.privatechannel, "Feedback submitted:\n" +
        "Text: " + feedback + "\n" +
        "TimeStamp: " + data.ts + "\n" +
        "Channel_ID (anonymous): " + data.channel + "\n" +
        "User_ID (anonymous): " + data.user);

    // console.log(data);

    // TODO: add message to PostgreSQL db

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
