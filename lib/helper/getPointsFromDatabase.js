 function getPointsFromDatabase(originalMessage, house, callback) {
   const self = this;

  this.db.get('SELECT points FROM houses WHERE house = ?', house, function (err, record) {
    debugger
    if (err || record === undefined) {
      return console.error('DATABASE ERROR', err);
    }

    if (typeof callback === "function") {
      callback(originalMessage, house, self, record);
    }
  });
}

module.exports = getPointsFromDatabase;