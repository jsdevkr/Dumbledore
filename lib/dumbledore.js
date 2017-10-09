const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');
// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
const parseMessage = require('./parseMessage');
const {OUTPUT} = require('./word');

class Dumbledore extends Bot {
  constructor(settings) {
    settings.token = settings.token || 'your-token';
    settings.name = settings.name || 'your-bot-name';
    super(settings);

    this.githubChannel = settings.githubChannel || 'null';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'dumbledore.db');
    this.db = null;
    this.user = null;
    this.params = {
      link_names: 1
    };
  }

  run() {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
  }

  _onStart() {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
    // this._onCron();
  }

  _onCron() {
    const cronMessage = {
      type: 'message',
      channel: 'your-channel-id',
      text: `${this.name} who is winning the house cup`
    };

    new Cron({
      cronTime: '00 59 23 * * 0',
      onTick: () => this._getAllHouseScores(cronMessage, this, this._getAllHousePointsCallback),
      start: false,
      timeZone: 'Asia/Seoul'
    }).start();
  }

  _loadBotUser() {
    [this.user] = this.users.filter((user) => {
      return user.name === this.name;
    });
  }

  _connectDb() {
    if (!fs.existsSync(this.dbPath)) {
      console.error('Database path "' + this.dbPath + '" does not exists or it\'s not readable.');
      process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
  }

  _firstRunCheck() {
    this.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', (err, record) => {
      const currentTime = (new Date()).toJSON();

      if (err) {
        return console.error('DATABASE ERROR:', err);
      }

      // this is a first run
      if (!record) {
        this._welcomeMessage();
        return this.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
      }

      // updates with new last running time
      this.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
  }

  _welcomeMessage() {
    this.postMessageToChannel(this.channels[0].name, OUTPUT.SAY_HELLO, { as_user: true });
  }

  _onMessage(message) {
    if (this._isTargetEvent(message)) {
      if ((message.text.indexOf('01100100 01110101 01101101 01100010 01101100 01100101 01100100 01101111 01110010 01100101') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01110100 01101111') > -1) || (message.text.indexOf('01110000 01101111 01101001 01101110 01110100 01110011 00100000 01100110 01110010 01101111 01101101') > -1)) {
        const binaryArray = message.text.split(' ');
        const decimalArray = binaryArray.map(function (x) { return parseInt(x, 2); });
        let finalString = String.fromCharCode.apply(this, decimalArray);
        if (finalString.indexOf('@') > -1) {
          const username = finalString.substring(finalString.indexOf('@') + 1).split(' ')[0];
          const userid = this.convertToUserID(username);
          finalString = finalString.replace('@' + username, '<@' + userid + '>');
        }
        message.text = finalString;
      }
      parseMessage.call(this, message);
    }
  }

  _isTargetEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = typeof message.channel === 'string' && message.channel[0] === 'C';
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  convertToUserID(key) {
    if (key in this.users) {
      return key;
    }
    return this.users.find((userid) => {
      if (userid.name === key) {
        return userid.id;
      }
      return false;
    });
  }
}

module.exports = Dumbledore;
