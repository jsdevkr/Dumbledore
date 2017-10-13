const { OUTPUT } = require('../word');
const Bot = require('slackbots');

const slackBot = (function () {
  if (!('BOT_API_KEY' in process.env) || !('BOT_NAME' in process.env)) {
    throw Error('please set BOT_API_KEY and BOT_NAME');
  }

  const bot = new Bot({
    token: process.env.BOT_API_KEY,
    name: process.env.BOT_NAME,
  });

  bot.explainSorting = async originalMessage => {
    await bot.announcePlainString(originalMessage, OUTPUT.START_SORTING);
  };

  bot.awardPointsCallback = async (originalMessage, house, result) => {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.pointTo(house, result), { as_user: true });
  };

  bot.deductPointsCallback = async (originalMessage, house, result) => {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.pointFrom(house, result), { as_user: true });
  };

  bot.getAllHousePointsCallback = async (originalMessage, house, result) => {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, OUTPUT.getWinner(house, result), { as_user: true });
  };

  bot.announcePlainString = async (originalMessage, message) => {
    const channel = await bot.getChannelById(originalMessage.channel);

    await bot.postMessageToChannel(channel.name, message, { as_user: true, link_names: 1 });
  };

  bot.getUserList = async () => {
    const users = await bot.getUsers();

    return users;
  };

  bot.getName = () => {
    return bot.name;
  };

  return bot;
}());

module.exports = slackBot;
