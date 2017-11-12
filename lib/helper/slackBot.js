const { OUTPUT } = require('../const');
const Bot = require('slackbots');

class SlackBot extends Bot {
  constructor({ token, name }) {
    if (!token || !name) {
      throw Error('please set token and name of bot');
    }
    super({ token, name });

    this.awardPointsCallback = this.awardPointsCallback.bind(this);
    this.getAllHousePointsCallback = this.getAllHousePointsCallback.bind(this);
    this.announcePlainString = this.announcePlainString.bind(this);
  }

  async awardPointsCallback(originalMessage, message) {
    const channel = await this.getChannelById(originalMessage.channel);
    await this.postMessageToChannel(channel.name, message, { as_user: true });
  }

  async getAllHousePointsCallback(originalMessage, house, result) {
    const channel = await this.getChannelById(originalMessage.channel);

    await this.postMessageToChannel(channel.name, OUTPUT.getWinner(house, result), { as_user: true });
  }

  async announcePlainString(originalMessage, message) {
    const channel = await this.getChannelById(originalMessage.channel);

    await this.postMessageToChannel(channel.name, message, { as_user: true, link_names: 1 });
  }

  async getUserList() {
    const users = await this.getUsers();

    return users;
  }

  getName() {
    return this.name;
  }
}

module.exports = SlackBot;
