function getPointsFromDatabase(originalMessage, house, callback) {
  this.db.get('SELECT points FROM houses WHERE house = ?', house, (err, record) => {
    if (err || record === undefined) {
      return console.error('DATABASE ERROR', err);
    }

    if (typeof callback === 'function') {
      callback(originalMessage, house, this, record);
    }
  });
}

module.exports = getPointsFromDatabase;
