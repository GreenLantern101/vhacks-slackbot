'use strict';

const db = require('./dbManager.js')();
const Promise = require('bluebird');

// set up Slackbot
const SlackBot = require('slackbots'); // only exposes Slack RTM api

const bot = new SlackBot({
  token: process.env.token,
  name: process.env.name,
});

// create params object

const params = {
  // reply_broadcast: 'false',
};


// on creation
bot.on('start', () => {
  db.connect();
  console.log(`Bot starting in channel: ${process.env.channel}`);
});


const processMessage = (userObj, channelObj, data) => {
  /*
    Slack channel naming convention:
    C, it's a public channel
    D, it's a DM with the user
    G, it's either a private channel or multi-person DM
    // src: https://stackoverflow.com/questions/41111227/how-can-a-slack-bot-detect-a-direct-message-vs-a-message-in-a-channel
  */
  let messageloc;
  if (data.channel.startsWith('D')) {
    messageloc = 'direct-message';
  } else if (data.channel.startsWith('C')) {
    messageloc = 'public-channel';
  } else if (data.channel.startsWith('G')) {
    messageloc = 'private-channel';
  }

  if (messageloc === 'public-channel' && !channelObj) {
    // occurs in DM and private channels
    console.log(`Channel ${data.channel} can't be found in listed channels.`);
  }
  if (!userObj) {
    // very rare
    console.log(`User ${data.user} can't be found in listed users.`);
    return;
  }

  // require direct mention if not DMed
  // only handle valid messages directed at the bot
  if (messageloc !== 'direct-message' && !data.text.includes('<@U4VTCUZ6U>')) {
    console.log('Received message, not directed at bot.');
    return;
  }

  // remove mention text
  const feedback = data.text.replace(/<@U4VTCUZ6U>/g, '').trim();

  // thank user for feedback in the same channel it was submitted in
  if (userObj.name) { bot.postMessageToUser(userObj.name, `Thanks for your feedback, ${userObj.name}!`, params); }

  /* fast check to see if invalid input
   * invalid if <6 alphabetic chars
   */
  if (feedback.replace(/[^A-Za-z]+/g, '').length < 6) {
    // if invalid, don't forward or save to db
    console.log(`Received message, too short: ${feedback}`);
    return;
  }

  // forward feedback to private group
  bot.postMessageToGroup(process.env.privatechannel, 'Feedback submitted:\n' +
    `Message Location: ${messageloc}\n` +
    `Text: ${feedback}\n` +
    `TimeStamp: ${data.ts}\n` +
    `Channel_ID (anonymous): ${data.channel}\n` +
    `User_ID (anonymous): ${data.user}`);

  // TODO: add message to MongoDB
};

const findUser = userID =>
  bot.getUsers()
  .then(obj => obj.members.filter(user => user.id === userID))
  .then(arr => arr[0]) // pick 1 (should only be one anyways)
  .catch(err => console.log(err));

const findChannel = channelID =>
  bot.getChannels()
  .then(obj => obj.channels.filter(channel => channel.id === channelID))
  .then(arr => arr[0]) // pick 1 (should only be one anyways)
  .catch(err => console.log(err));

// on event firing (all events)
bot.on('message', (data) => {
  // ignore non-message events
  if (data.type !== 'message') {
    // console.log("Ignored non-message event");
    return;
  }
  // ignore it's own message responses
  if (data.subtype && data.subtype === 'bot_message') {
    // console.log("Ignored message by bot itself");
    return;
  }

  if (!data.user) {
    console.log(data);
    console.log('User info missing from message. Ignored message.');
    return;
  }
  if (!data.channel) {
    console.log(data);
    console.log('Channel info missing from message. Ignored message.');
    return;
  }
  console.log(data);

  // match user and channel objects & process message
  Promise.all([findUser(data.user), findChannel(data.channel)])
    .then(([userObj, channelObj]) => processMessage(userObj, channelObj, data));
});
