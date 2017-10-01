const getPointsFromDatabase = require('../helper/getPointsFromDatabase');
const botCommand = require('../helper/botCommand');

function deductPoints(originalMessage) {
  let points = originalMessage.text.split(' ')[0].replace(/[^\d.]/g, '');

  if (points > 100) { points = 100; }
  if (originalMessage.text.toLowerCase().indexOf('gryffindor') > -1) {
    this.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "gryffindor"', points);
    this.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase.call(this, originalMessage, "gryffindor", this, botCommand.deductPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) {
    this.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "hufflepuff"', points);
    getPointsFromDatabase.call(this, originalMessage, "hufflepuff", this, botCommand.deductPointsCallback);
    this.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) {
    this.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "ravenclaw"', points);
    getPointsFromDatabase.call(this, originalMessage, "ravenclaw", this, botCommand.deductPointsCallback);
    this.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('slytherin') > -1) {
    this.db.run('UPDATE houses SET points = MAX(0, points - ?) WHERE house = "slytherin"', points);
    getPointsFromDatabase.call(this, originalMessage, "slytherin", this, botCommand.deductPointsCallback);
    this.db.run('UPDATE students SET points_taken = (points_taken + ?) WHERE user_id = ?', points, originalMessage.user);
  } else if (originalMessage.text.toLowerCase().indexOf('@') > -1) {
    const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];
    
    this.db.get('SELECT user_id, username, house FROM students WHERE user_id = ?', student, (err, record) => {
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