// const random = require('random-js')(); // uses the nativeMath engine
const Cron = require('cron').CronJob; // cron works
const { INPUT, OUTPUT, DB } = require('./const');
const SlackBot = require('./helper/slackBot');

class Dumbledore {
  constructor(settings) {
    const token = settings.token || 'your-token';
    const name = settings.name || 'your-bot-name';

    this.slackBot = new SlackBot({ token, name });

    this.id = settings.id;
    this.user = null;
    this.githubChannel = settings.githubChannel || 'null';
    this.name = this.slackBot.getName();
    this.awardPoints = require('./controller/awardPoints').bind(this);
    this.replyWithDumbledore = require('./controller/replyWithDumbledore').bind(this);
    this.getUser = require('./controller/getUser').bind(this);
    this.replyWithGithub = require('./controller/replyWithGithub').bind(this);
    this.helpMessage = require('./controller/helpMessage').bind(this);
    this.convertToUserName = require('./controller/convertToUserName').bind(this);
  }

  run() {
    return new Promise((resolve, reject) => {
      this.slackBot.on('start', () => {
        this.onStart().then(() => {
          resolve();
        }, (error) => {
          console.error('error on dumbledore', error);
          reject(error);
        });
      });

      this.slackBot.on('error', (error) => {
        console.error('error on dumbledore', error);
      });

      this.slackBot.on('message', (message) => {
        this.onMessage(message);
      });
    });
  }

  async onStart() {
    await this.loadBotUser();
    await this.firstRunCheck();
    await this.getUser();
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

  async firstRunCheck() {
    try {
      const query = new Parse.Query(DB.INFO.CALL);
      query.equalTo('botId', this.id);
      query.equalTo('name', DB.INFO.LASTRUN);
      const doc = await query.first();
      const currentTime = (new Date()).toJSON();

      // this is a first run
      if (!doc) {
        this.welcomeMessage();
        const _doc = new Parse.Object(DB.INFO.CALL);
        return _doc.save({ name: DB.INFO.LASTRUN, val: currentTime, botId: this.id });
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
      this.saveMessage(message);
    } else if (this.isReactionEvent(message)) {
      if (message.type === 'reaction_added') {
        this.awardPoints(message);
      }
      this.saveMessage(message);
    }
  }

  async saveMessage(message) {
    // save message
    if (message.type === 'message') {
      const _message = new Parse.Object(DB.MESSAGE.CALL);
      await _message.save({
        [DB.MESSAGE.BOT_ID]: this.id,
        [DB.MESSAGE.USER_ID]: message.user,
        [DB.MESSAGE.TEXT]: message.text,
        [DB.MESSAGE.CONTENT]: message,
      });
    }
  }
  isChatMessageEvent(message) {
    const isChatMessage = message.type === 'message' && (Boolean(message.text) || Boolean(message.attachments));
    const isChannelConversation = (typeof message.channel === 'string' && message.channel[0] === 'C');
    const isFromDumbledore = message.user === this.user.id;
    const isFromSlackbot = message.user === 'USLACKBOT';

    return isChatMessage && isChannelConversation && !isFromDumbledore && !isFromSlackbot;
  }

  isReactionEvent(message) {
    if (typeof message.item === 'undefined') return false;
    const isReactionMessage = message.type === 'reaction_added' || message.type === 'reaction_removed';
    const isScoreReaction = message.reaction === '100';
    const isChannelConversation = (typeof message.item.channel === 'string' && message.item.channel[0] === 'C');
    const isSameUser = message.user === message.item_user;
    const isToSlackbot = message.item_user === this.user.id;

    return isReactionMessage && isScoreReaction && isChannelConversation && !isSameUser && !isToSlackbot;
  }

  parseMessage(message) {
    /* todo: determine what if handle multiple messages? */
    const text = message.text.toLowerCase();

    if (text.includes(INPUT.POINTS_TO.CALL)) {
      this.awardPoints(message);
    } else if (text.includes(INPUT.PROFESSOR.CALL) || text.includes(this.name)) {
      this.replyWithDumbledore(message);
    } else if (text.includes(INPUT.HELP.CALL)) {
      this.helpMessage(message);
    } else if (message.channel != null && message.channel === this.githubChannel) {
      this.replyWithGithub(message);
    }
  }
}

module.exports = Dumbledore;