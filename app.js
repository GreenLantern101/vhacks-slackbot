'use strict';

// declare modules to use

const dbManager = require('./dbManager.js');

// set up Slackbot
const fs = require('fs');
const SlackBot = require('slackbots');
const bot = new SlackBot({
  token: process.env.token,
  name: process.env.name,
});

// create params object
const params = {
  reply_broadcast: 'false',
};

// on creation
bot.on('start', () => {
  console.log(`Bot starting in channel: ${process.env.channel}`);
});

// on posted message
bot.on('message', (data) => {
    // only handle valid messages directed at the bot
  if (!data.user || !data.text || !data.channel) {
    return;
  }

    // require direct mention if not DMed
  if (!data.text.includes('<@U4VTCUZ6U>')) {
    console.log(data);
    return;
  }

    // remove mention text
  const feedback = data.text.replace(/<@U4VTCUZ6U>/g, '').trim();

    // extract user and channel
  const user = find(bot.getUsers()._value.members, 'id', data.user);
  const channel = find(bot.getChannels()._value.channels, 'id', data.channel);

  if (!channel) {
    console.log("channel can't be found");
        // console.log(bot.getChannels()._value.channels);
        // return;
  }

    // log feedback in console
    // console.log("In " + channel.name + ", " + user.name + " says: " + data.text);

    // thank user in channel for feedback in the same channel it was submitted in
  bot.postMessageToChannel(data.channel,
        `Thanks for your feedback, ${user.name}!`,
        params);

    /* fast check to see if invalid input
    * invalid if <6 alphabetic chars
    */
  if (feedback.replace(/[^A-Za-z]+/g, '').length < 6) {
        // if invalid, don't forward or save to db
    return;
  }

    // forward feedback to private group
  bot.postMessageToGroup(process.env.privatechannel, `${'Feedback submitted:\n' +
        'Text: '}${feedback}\n` +
        `TimeStamp: ${data.ts}\n` +
        `Channel_ID (anonymous): ${data.channel}\n` +
        `User_ID (anonymous): ${data.user}`);

    // console.log(data);

    // TODO: add message to PostgreSQL db
});

// returns 1st value that matches
function find(arr, field, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      return arr[i];
    }
  }
  return undefined;
}
