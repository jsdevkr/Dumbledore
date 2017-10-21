<<<<<<< HEAD
'use strict'; 

const path = require('path');
const fs = require('fs');
const SQLite = require("sqlite3").verbose();
const Bot = require("slackbots");
const random = require("random-js")(); // uses the nativeMath engine
const cron = require('cron').CronJob; // cron works
=======
const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
<<<<<<< HEAD
const parseMessage = require('./parseMessage');
const { OUTPUT } = require('./word');
>>>>>>> kosslab_master

class Dumbledore extends Bot { //Bot을 상속
  constructor(settings) { //javascript 생성자를 생성 -> constructor
    settings.token = settings.token || 'your-token'; //교수님 질문
    settings.name = settings.name || 'your-bot-name';
    super(settings); //상위 생성자 호출
=======
const { INPUT, OUTPUT, DB } = require('./word');
const SlackBot = require('./helper/slackBot');

class Dumbledore {
  constructor(settings) {
    const token = settings.token || 'your-token';
    const name = settings.name || 'your-bot-name';

    this.slackBot = new SlackBot({ token, name });
>>>>>>> kosslab_master

    this.githubChannel = settings.githubChannel || 'null';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'dumbledore.db');
    this.db = null;
    this.user = null;
    this.name = this.slackBot.getName();

    this.awardPoints = require('./controller/awardPoints').bind(this);
    this.deductPoints = require('./controller/deductPoints').bind(this);
    this.replyWithDumbledore = require('./controller/replyWithDumbledore').bind(this);
    this.replyWithGithub = require('./controller/replyWithGithub').bind(this);
    this.helpMessage = require('./controller/helpMessage').bind(this);
    this.getPointsFromDatabase = require('./helper/getPointsFromDatabase').bind(this);
  }

<<<<<<< HEAD
  run() { //실행 메소드
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
=======
  run() {
    return new Promise((resolve) => {
      this.slackBot.on('start', () => {
        this.onStart().then(() => {
          resolve();
        });
      });
      this.slackBot.on('message', (message) => {
        this.onMessage(message);
      });
    });
>>>>>>> kosslab_master
  }

  async onStart() {
    this.connectDb();
    this.checkBackend();
    await this.loadBotUser();
    await this.firstRunCheck();
    this.onCron();
  }

  onCron() {
    const doRegular = new Cron({
      cronTime: '00 39 10 * * 2',
      onTick: () => this.welcomeMessage(), // set function to run something regularly
      start: false,
      timeZone: 'Asia/Seoul'
    });

    doRegular.start();
  }

<<<<<<< HEAD
<<<<<<< HEAD
  _loadBotUser() { //질문
    const self = this;
    self.user = this.users.filter(function (user) {
      return user.name === self.name;
    })[0];
=======
  _loadBotUser() {
    [this.user] = this.users.filter((user) => {
      return user.name === this.name;
    });
>>>>>>> kosslab_master
=======
  async loadBotUser() {
    this.user = await this.slackBot.getUser(this.name);
>>>>>>> kosslab_master
  }

  connectDb() {
    if (!fs.existsSync(this.dbPath)) {
      console.error('Database path "' + this.dbPath + '" does not exists or it\'s not readable.');
      process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
  }

  checkBackend() {
    if (!Parse || !Parse.serverURL || !Parse.applicationId) {
      console.error('Parse Backend does not exists.');
      process.exit(1);
    }
  }

  async firstRunCheck() {
    try {
      const query = new Parse.Query(DB.INFO.CALL);
      query.equalTo('name', 'lastrun');
      const doc = await query.first();
      const currentTime = (new Date()).toJSON();

      // this is a first run
      if (!doc) {
        this.welcomeMessage();
        const _doc = new Parse.Object(DB.INFO.CALL);
        return _doc.save({ name: DB.INFO.LASTRUN, val: currentTime });
      }

      // updates with new last running time
      return doc.save({ val: currentTime });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async welcomeMessage() {
    const { channels } = await this.slackBot.getChannels();
    this.channels = channels.filter(channel => channel.is_member);
    if (!this.channels.length) return;
    return this.slackBot.postTo(this.channels[0].name, OUTPUT.SAY_HELLO, { as_user: true });
  }

  onMessage(message) {
    if (this.isTargetEvent(message)) {
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
      this.parseMessage(message);
    }
  }

  isTargetEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = typeof message.channel === 'string' && message.channel[0] === 'C';
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  parseMessage(message) {
    /* todo: determine what if handle multiple messages? */
    const text = message.text.toLowerCase();

    if (text.includes(INPUT.POINTS_TO.CALL)) {
      this.awardPoints(message);
    } else if (text.includes(INPUT.POINTS_FROM.CALL)) {
      this.deductPoints(message);
    } else if (text.includes(INPUT.PROFESSOR.CALL) || text.includes(this.name)) {
      this.replyWithDumbledore(message);
    } else if (text.includes(INPUT.HELP.CALL)) {
      this.helpMessage(message);
    } else if (message.channel != null && message.channel === this.githubChannel) {
      this.replyWithGithub(message);
    }
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
