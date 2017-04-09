var express = require('express'),
    app = express(),
    port = 8000;

var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));
app.use(require('./controllers/dashboard.js'));

//load config file
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));

// create a bot
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
    // all ingoing events https://api.slack.com/rtm
    if (!data.user || !data.text) {
        return;
    }
    console.log("In " + data.channel + ", " + data.user + " says: " + data.text);
    bot.postMessageToChannel(config.channel, 'Message received.', params);

});

server.listen(port, function() {
    console.log('Listening on port ' + port)
});

function getMessages(){

}
