const botCommand = {
  explainSorting: function(originalMessage, bot) {
    this.announcePlainString(originalMessage, 'Students you have two choices for sorting. If you wish to choose your house you need only ask \`Professor can I please join Gryffindor\` For those more daring, you can let the Hat of Godric Gryffindor decide. Just say \`Professor I would like to put my fate in the hands of the Sorting Hat\` \n Good luck, let the sorting begin.', bot);
  },
  awardPointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);    

    bot.postMessageToChannel(channel.name, 'Congratulations ' + house.capitalizeFirstLetter() + '! ' + house.capitalizeFirstLetter() + ' house has ' + result.points + ' points!', { as_user: true });
  },
  deductPointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);
    
    bot.postMessageToChannel(channel.name, 'Alas ' + house.capitalizeFirstLetter() + '. ' + house.capitalizeFirstLetter() + ' house now only has ' + result.points + ' points. Do not dwell on your misdeeds, there is potential for greatness in all students!', { as_user: true });
  },
  getAllHousePointsCallback: async function(originalMessage, house, bot, result) {
    const channel = await bot.getChannelById(originalMessage.channel);

    bot.postMessageToChannel(channel.name, house.capitalizeFirstLetter() + ' House: ' + result.points + '\n', { as_user: true });
  },
  announcePlainString: async function(originalMessage, message, bot) {
    const channel = await bot.getChannelById(originalMessage.channel);
    
    bot.postMessageToChannel(channel.name, message, { as_user: true, link_names: 1 });
  }
};

module.exports = botCommand;