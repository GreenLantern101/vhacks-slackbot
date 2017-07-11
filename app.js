'use strict';

const dbManager = require('./dbManager.js');
const Promise = require('bluebird');

// set up Slackbot
const SlackBot = require('slackbots');

const bot = new SlackBot({
  token: process.env.token,
  name: process.env.name,
});

// create params object

const params = {
  //reply_broadcast: 'false',
};


// on creation
bot.on('start', () => {
  console.log(`Bot starting in channel: ${process.env.channel}`);
});


const processMessage = (userObj, channelObj, data) => {

  if (!channelObj) {
    console.log(`Channel ${data.channel} can't be found in listed channels.`);
    //return;
  }
  if (!userObj) {
    console.log(`User ${data.user} can't be found in listed users.`);
    //return;
  }

  // require direct mention if not DMed
  // only handle valid messages directed at the bot
  /*
  if (!data.text.includes('<@U4VTCUZ6U>')) {
    console.log(data);
    return;
  }
  */

  // remove mention text
  const feedback = data.text.replace(/<@U4VTCUZ6U>/g, '').trim();

  // log feedback in console
  //console.log("In " + channelObj.name + ", " + userObj.name + " says: " + data.text);

  // thank user for feedback in the same channel it was submitted in
  bot.postMessageToUser(`Thanks for your feedback, ${userObj.name}!`, params);

  /* fast check to see if invalid input
   * invalid if <6 alphabetic chars
   */
  if (feedback.replace(/[^A-Za-z]+/g, '').length < 6) {
    // if invalid, don't forward or save to db
    console.log(`Received message, too short: ${feedback}`);
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
};

const findUser = (userID) =>
  bot.getUsers()
  .then(obj => obj.members.filter(user => user.id == userID))
  .then(arr => arr[0]) // pick 1 (should only be one anyways)
  .catch(err => console.log(err));

const findChannel = (channelID) =>
  bot.getChannels()
  .then(obj => obj.channels.filter(channel => channel.id == channelID))
  .then(arr => arr[0]) // pick 1 (should only be one anyways)
  .catch(err => console.log(err));

// on event firing (all events)
bot.on('message', (data) => {
  // ignore non-message events
  if (data.type !== "message") {
    return;
  }
  // ignore it's own message responses
  if(data.subtype && data.subtype==="bot_message"){
    return;
  }

  // critical message data missing
  if (!data.user || !data.channel) {
    console.log(data);
    console.log("ERROR: part of data missing from this message. Ignoring message.");
    
    return;
  }

  console.log(data);

  // find user and channel objects & process message
  Promise.all([findUser(data.user), findChannel(data.channel)])
    .then(([userObj, channelObj]) => processMessage(userObj, channelObj, data));
});