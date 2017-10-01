'use strict';

const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');
const random = require("random-js")(); // uses the nativeMath engine
const parseEvent = require('./parseEvent');

// database variables
global.db = null;
global.dbPath = null;

class Dumbledore extends Bot {
  constructor(settings) {
    settings.token = settings.token || 'your-token';
    settings.name = settings.name || 'your-bot-name';
    settings.githubChannel = settings.githubChannel || 'null';
    global.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'dumbledore.db');

    super(settings);
  }

  run() {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }

  _onStart() {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
  }

  _loadBotUser() {
    const self = this;
    self.user = this.users.filter(function (user) {
      return user.name === self.name;
    })[0];
  }

  _connectDb() {
    if (!fs.existsSync(dbPath)) {
      console.error('Database path ' + '"' + dbPath + '" does not exists or it\'s not readable.');
      process.exit(1);
    }

    global.db = new SQLite.Database(dbPath);
  }

  _firstRunCheck() {
    var self = this;
    global.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
      var currentTime = (new Date()).toJSON();

      if (err) {
        return console.error('DATABASE ERROR:', err);
      }

      // this is a first run
      if (!record) {
        self._welcomeMessage();
        return global.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
      }

      // updates with new last running time
      global.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
  }

  _welcomeMessage() {
    this.postMessageToChannel(this.channels[0].name, 'Welcome to Hogwarts everyone!' +
      '\n Now, in a few moments you will pass through these doors and join your classmates, but before you take your seats, you must be sorted into your houses. They are Gryffindor, Hufflepuff, Ravenclaw, and Slytherin. Now while you\'re here, your house will be like your family. Your triumphs will earn you points. Any rule breaking, and you will lose points. At the end of the year, the house with the most points is awarded the house cup.' + '\n I Albus Dumbledore will award points on your behalf. Just say `10 points to Gryffindor` + or `5 points to @benc` to award points',
      { as_user: true });
  }

  _onMessage(message) {
    if (this._isTargetEvent(message)) {
      if ((message.text.indexOf('01100100 01110101 01101101 01100010 01101100 01100101 01100100 01101111 01110010 01100101') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01110100 01101111') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01100110 01110010 01101111 01101101') > -1)) {
        var binaryArray = message.text.split(" ");
        var decimalArray = binaryArray.map(function (x) { return parseInt(x, 2); });
        var finalString = String.fromCharCode.apply(this, decimalArray);
        if (finalString.indexOf('@') > -1) {
          var username = finalString.substring(finalString.indexOf('@') + 1).split(" ")[0];
          var userid = this.convertToUserID(this, username);
          finalString = finalString.replace('@' + username, '<@' + userid + '>');
        }
        message.text = finalString;
      }
      parseEvent.call(this, message);
    }
  }

  _isTargetEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = typeof message.channel === 'string' && message.channel[0] === 'C';
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  convertToUserID(bot, key) {
    if (key in bot.users) {
      return key
    }
    for (var userid of bot.users) {
      if (userid.name == key) {
        return userid.id;
      }
    }
  }

  /*
  _forceSortRemaining(originalMessage, bot) {
    for (var i=0; i < bot.users.length; i++) {
      console.log('user id: ' + JSON.stringify(bot.users[i]));
      var message = originalMessage;
      message.user = bot.users[i].id;
      bot._rollTheDice(message, bot);
    };
  };
  */
}

module.exports = Dumbledore;

String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
