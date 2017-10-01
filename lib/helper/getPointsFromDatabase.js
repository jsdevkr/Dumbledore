 function getPointsFromDatabase(originalMessage, house, bot, callback) {
  bot.db.get('SELECT points FROM houses WHERE house = ?', house, function (err, record) {
    debugger
    if (err || record === undefined) {
      return console.error('DATABASE ERROR', err);
    }

    if (typeof callback === "function") {
      callback(originalMessage, house, bot, record);
    }
  });
}

module.exports = getPointsFromDatabase;