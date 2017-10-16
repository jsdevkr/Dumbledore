const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
const parseMessage = require('./parseMessage');
const { OUTPUT } = require('./word');
const SlackBot = require('./helper/slackBot');

class Dumbledore {
  constructor(settings) {
    const token = settings.token || 'your-token';
    const name = settings.name || 'your-bot-name';

    this.slackBot = new SlackBot({ token, name });

    this.githubChannel = settings.githubChannel || 'null';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'dumbledore.db');
    this.db = null;
    this.user = null;
    this.name = this.slackBot.getName();
  }

  run() {
    return new Promise((resolve) => {
      this.slackBot.on('start', () => {
        this._onStart().then(() => {
          resolve();
        });
      });
      this.slackBot.on('message', (message) => {
        this._onMessage(message);
      });
    });
  }

  async _onStart() {
    this._connectDb();
    this._checkBackend();
    await this._loadBotUser();
    await this._firstRunCheck();
    // this._onCron();
  }

  async _onCron() {
    new Cron({
      cronTime: '00 00 00 * * 1',
      onTick: () => this._welcomeMessage(), // set function to run something regularly
      start: true,
      timeZone: 'Asia/Seoul'
    });
  }

  async _loadBotUser() {
    this.user = await this.slackBot.getUser(this.name);
  }

  _connectDb() {
    if (!fs.existsSync(this.dbPath)) {
      console.error('Database path "' + this.dbPath + '" does not exists or it\'s not readable.');
      process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
  }

  _checkBackend() {
    if (!Parse || !Parse.serverURL || !Parse.applicationId) {
      console.error('Parse Backend does not exists.');
      process.exit(1);
    }
  }

  async _firstRunCheck() {
    try {
      const query = new Parse.Query('Info');
      query.equalTo('name', 'lastrun');
      const doc = await query.first();
      const currentTime = (new Date()).toJSON();

      // this is a first run
      if (!doc) {
        this._welcomeMessage();
        const _doc = new Parse.Object('Info');
        return _doc.save({ name: 'lastrun', val: currentTime });
      }

      // updates with new last running time
      return doc.save({ val: currentTime });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async _welcomeMessage() {
    const { channels } = await this.slackBot.getChannels();
    this.channels = channels.filter(channel => channel.is_member);
    if (!this.channels.length) return;
    return this.slackBot.postTo(this.channels[0].name, OUTPUT.SAY_HELLO, { as_user: true });
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

  static async convertToUserID(key) {
    const users = await this.slackBot.getUsers();

    if (key in users) {
      return key;
    }
    return users.find((userid) => {
      if (userid.name === key) {
        return userid.id;
      }
      return false;
    });
  }
}

module.exports = Dumbledore;
