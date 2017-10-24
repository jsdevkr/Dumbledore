const { DB } = require('../word');

function getPointsFromDatabase(originalMessage, house, callback) {
  const query = new Parse.Query(DB.HOUSE.CALL);

  query.equalTo('name', house);
  query.first({
    success: (o) => {
      if (typeof callback === 'function') {
        const point = o.get('val');
        callback(originalMessage, house, point);
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
