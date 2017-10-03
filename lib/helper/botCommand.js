const { OUTPUT } = require('../word');

const botCommand = {
  explainSorting: function(originalMessage, bot) {
    this.announcePlainString(originalMessage, OUTPUT.START_SORTING, bot);
  },
  awardPointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);    

    bot.postMessageToChannel(channel.name, OUTPUT.POINT_TO(house, result), { as_user: true });
  },
  deductPointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);
    
    bot.postMessageToChannel(channel.name, OUTPUT.POINT_FROM(house, result), { as_user: true });
  },
  getAllHousePointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);

    bot.postMessageToChannel(channel.name, OUTPUT.GET_WINNER(house, result), { as_user: true });
  },
  announcePlainString: async function(originalMessage, message, bot) {
    const channel = await bot.getChannelById(originalMessage.channel);
    
    bot.postMessageToChannel(channel.name, message, { as_user: true, link_names: 1 });
  }
};

module.exports = botCommand;