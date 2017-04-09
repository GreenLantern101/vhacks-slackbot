var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: '<token here>', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'VandyHacks Slackbot'
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':cat:'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    bot.postMessageToChannel('general', 'meow!', params){

    }

    // define existing username instead of 'user_name'
    bot.postMessageToUser('user_name', 'meow!', params){

    }

});
