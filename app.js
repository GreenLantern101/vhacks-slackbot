var SlackBot = require('slackbots');

var express = require('express'),
    app = express(),
    port = 8000;

var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));

// create a bot

var bot = new SlackBot({
        // Add a bot https://my.slack.com/services/new/bot and put the token
        token: config.token,
        name: config.name
    });

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        reply_broadcast: 'false'
    };

    var arr = bot.getChannels();
    for(var i in arr){
        console.log(i);
    }
console.log(JSON.stringify(arr));

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    console.log("Channel: " + config.channel);
    bot.postMessageToChannel(config.channel, 'Hello!*Note this is for testing.*', params);

    // define existing username instead of 'user_name'
    //bot.postMessageToUser('user_name', 'Hello!', params);

});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log("In "+ data.channel+", "+data.user+" says: "+data.text);
});


server.listen(port, function() {
    console.log('Listening on port ' + port)
});
