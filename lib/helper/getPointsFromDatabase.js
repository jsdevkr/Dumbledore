 function getPointsFromDatabase(originalMessage, house, bot, callback) {
  var bot = bot;

  global.db.get('SELECT points FROM houses WHERE house = ?', house, function (err, record) {
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