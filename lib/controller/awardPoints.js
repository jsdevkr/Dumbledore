const Parse = require('parse/node');
const { DB, OUTPUT } = require('../word');

async function awardPoints(message) {
  const point = parseInt(message.text.split(' ')[0].replace(/[^\d.]/g, ''), 10);
  const userId = message.text.substring(message.text.indexOf('@') + 1).split('>')[0];
  const botId = this.name;

  if (typeof botId === 'undefined' || typeof userId === 'undefined' || typeof point === 'undefined') return;
  if (botId === this.slackBot.name) return this.slackBot.awardPointsCallback(message, OUTPUT.FAIL_POINT_TO);
  const Student = new Parse.Object(DB.STUDENT.CALL);
  const query = new Parse.Query(Student);
  query.equalTo(DB.STUDENT.BOT_ID, botId).equalTo(DB.STUDENT.USER_ID, userId);

  try {
    const results = await query.first();

    results.increment(DB.STUDENT.POINT, point);
    results.save();
    this.slackBot.awardPointsCallback(message, OUTPUT.pointTo(results.attributes));
  } catch (err) {
    console.log(err);
  }
}

module.exports = awardPoints;
