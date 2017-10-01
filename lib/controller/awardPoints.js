const getPointsFromDatabase = require('../helper/getPointsFromDatabase');
const botCommand = require('../helper/botCommand');

function awardPoints(originalMessage) {
  debugger
  let points = originalMessage.text.split(' ')[0].replace(/[^\d.]/g, '');
  if (points > 100) { points = 100; }
  
  if (originalMessage.text.toLowerCase().indexOf('gryffindor') > -1) {
    this.db.run('UPDATE houses SET points = points + ? WHERE house = "gryffindor"', points);
    this.db.run('UPDATE students SET points_given = (points_given + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase.call(this, originalMessage, "gryffindor", this, botCommand.awardPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('hufflepuff') > -1) {
    this.db.run('UPDATE houses SET points = points + ? WHERE house = "hufflepuff"', points);
    this.db.run('UPDATE students SET points_given = (points_given + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase.call(this, originalMessage, "hufflepuff", this, botCommand.awardPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('ravenclaw') > -1) {
    this.db.run('UPDATE houses SET points = points + ? WHERE house = "ravenclaw"', points);
    this.db.run('UPDATE students SET points_given = (points_given + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase.call(this, originalMessage, "ravenclaw", this, botCommand.awardPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('slytherin') > -1) {
    this.db.run('UPDATE houses SET points = points + ? WHERE house = "slytherin"', points);
    this.db.run('UPDATE students SET points_given = (points_given + ?) WHERE user_id = ?', points, originalMessage.user);
    getPointsFromDatabase.call(this, originalMessage, "slytherin", this, botCommand.awardPointsCallback);
  } else if (originalMessage.text.toLowerCase().indexOf('@') > -1) {
    const student = originalMessage.text.substring(originalMessage.text.indexOf('@') + 1).split('>')[0];

    this.db.get('SELECT user_id, username, house FROM students WHERE user_id = ?', student, (err, record) => {
      if (err) {
        return console.error('DATABASE ERROR:', err);
      }
      if (record !== undefined) {
        const message = originalMessage;
        message.text = points + " " + record.house;
        this.awardPoints(message);

        this.db.run('UPDATE students SET points_earned = (points_earned + ?) WHERE user_id = ?', points, student);
      }
    });
  }  
}

module.exports = awardPoints;