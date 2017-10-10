const { OUTPUT } = require('../word');

const botCommand = {
  async explainSorting(originalMessage, bot) {
    await this.announcePlainString(originalMessage, OUTPUT.START_SORTING, bot);
  },
  async awardPointsCallback(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.pointTo(house, result), { as_user: true });
  },
  async deductPointsCallback(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.pointFrom(house, result), { as_user: true });
  },
  async getAllHousePointsCallback(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.getWinner(house, result), { as_user: true });
  },
  async announcePlainString(originalMessage, message, bot) {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, message, { as_user: true, link_names: 1 });
  }
};

module.exports = botCommand;
