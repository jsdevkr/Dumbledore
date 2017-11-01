const path = require('path');
// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
const { INPUT, OUTPUT, DB } = require('./word');
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
    this.awardPoints = require('./controller/awardPoints').bind(this);
    this.deductPoints = require('./controller/deductPoints').bind(this);
    this.replyWithDumbledore = require('./controller/replyWithDumbledore').bind(this);
    this.replyWithGithub = require('./controller/replyWithGithub').bind(this);
    this.helpMessage = require('./controller/helpMessage').bind(this);
    this.getPointsFromDatabase = require('./helper/getPointsFromDatabase').bind(this);
  }

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
  }

  async onStart() {
    this.checkBackend();
    await this.loadBotUser();
    await this.firstRunCheck();
    this.onCron();
  }

  onCron() {
    const doRegular = new Cron({
      cronTime: '00 00 00 * * 1',
      onTick: () => this.welcomeMessage(), // set function to run something regularly
      start: false,
      timeZone: 'Asia/Seoul'
    });

    doRegular.start();
  }

  async loadBotUser() {
    this.user = await this.slackBot.getUser(this.name);
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
      query.equalTo('name', DB.INFO.LASTRUN);
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
    if (this.isChatMessageEvent(message)) {
      this.parseMessage(message);
    } else if (this.isReplayEvent(message)) {
      const { user } = message.message.replies[message.message.reply_count - 1];
      const point = 5;
      this.awardPoints(this.name, user, point);
    } else if (this.isReactionEvent(message)) {
      const user = message.item_user;
      const point = 10;
      if (message.type === 'reaction_added') {
        this.awardPoints(this.name, user, point);
      } else {
        this.awardPoints(this.name, user, -point);
      }
    }
  }

  isChatMessageEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = (typeof message.channel === 'string' && message.channel[0] === 'C');
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  isReplayEvent(message) {
    if (typeof message.subtype === 'undefined') return false;
    const isReplayMessage = message.type === 'message' && message.subtype === 'message_replied';
    const isChannelConversation = (typeof message.channel === 'string' && message.channel[0] === 'C');
    const isSameUser = message.message.user === message.message.replies[message.message.reply_count - 1].user;
    const isFromSlackbot = message.message.user === this.user.id;

    return isReplayMessage && isChannelConversation && !isSameUser && !isFromSlackbot;
  }

  isReactionEvent(message) {
    if (typeof message.item === 'undefined') return false;
    const isReactionMessage = message.type === 'reaction_added' || message.type === 'reaction_removed';
    const isScoreReaction = message.reaction === '100';
    const isChannelConversation = (typeof message.item.channel === 'string' && message.item.channel[0] === 'C');
    const isSameUser = message.user === message.item_user;
    const isFromSlackbot = message.item_user === this.user.id;

    return isReactionMessage && isScoreReaction && isChannelConversation && !isSameUser && !isFromSlackbot;
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
