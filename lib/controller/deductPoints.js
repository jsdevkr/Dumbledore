const getPointsFromDatabase = require('../helper/getPointsFromDatabase');
const botCommand = require('../helper/botCommand');

function deductPoints(originalMessage) {
  let points = originalMessage.text.split(' ')[0].replace(/[^\d.]/g, '');

  if (points > 100) { points = 100; }
  if (originalMessage.text.toLowerCase().indexOf('gryffindor') > -1) {
    global.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "gryffindor"', points);
    global.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase(originalMessage, "gryffindor", this, botCommand.deductPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) {
    global.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "hufflepuff"', points);
    getPointsFromDatabase(originalMessage, "hufflepuff", this, botCommand.deductPointsCallback);
    global.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) {
    global.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "ravenclaw"', points);
    getPointsFromDatabase(originalMessage, "ravenclaw", this, botCommand.deductPointsCallback);
    global.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('slytherin') > -1) {
    global.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "slytherin"', points);
    getPointsFromDatabase(originalMessage, "slytherin", this, botCommand.deductPointsCallback);
    global.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('@') > -1) {
    const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
    
    global.db.get('SELECT user_id, username, house FROM students WHERE user_id = ?', student, function (err, record) {
      if (err) {
        return console.error('DATABASE ERROR:', err);
      }

      if (record != undefined) {
        const message = originalMessage;
        message.text = points + " " + record.house;
        this.deductPoints(message);
      }
    });
  }
}

module.exports = deductPoints;