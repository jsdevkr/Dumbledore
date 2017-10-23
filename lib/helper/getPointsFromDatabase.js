const { DB } = require('../word');
const query = new Parse.Query(DB.HOUSE.CALL);

function getPointsFromDatabase(originalMessage, house, callback) {
  query.equalTo('name', house);
  query.find({
    success: (res) => {
      if (typeof callback === 'function') {
        callback(originalMessage, house, res);
      }
    },
    error: (err) => console.error('DATABASE ERROR', err)
  });

/*
  this.db.get('SELECT points FROM houses WHERE house = ?', house, (err, record) => {
    if (err || record === undefined) {
      return console.error('DATABASE ERROR', err);
    }

    if (typeof callback === 'function') {
      callback(originalMessage, house, record);
    }
  });
*/
}

module.exports = getPointsFromDatabase;
