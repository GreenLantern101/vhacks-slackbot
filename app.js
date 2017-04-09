var SlackBot = require('slackbots');

var express = require('express'),
    app = express(),
    port = 8000;

var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));

// create a bot

var bot = new SlackBot({
        // Add a bot https://my.slack.com/services/new/bot and put the token
        token: '',
        name: 'VandyHacks Slackbot'
    });

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        reply_broadcast: 'false'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    bot.postMessageToChannel('general', 'Hello!', params);

    // define existing username instead of 'user_name'
    bot.postMessageToUser('user_name', 'Hello!', params);

});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);
});


server.listen(port, function() {
    console.log('Listening on port ' + port)
});
