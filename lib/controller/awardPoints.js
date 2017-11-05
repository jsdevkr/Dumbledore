const Parse = require('parse/node');
const { DB } = require('../word');

function awardPoints(botId, userId, point) {
  if (typeof botId === 'undefined' || typeof userId === 'undefined' || typeof point === 'undefined') return;
  const Student = new Parse.Object(DB.STUDENT.CALL);
  const query = new Parse.Query(Student);
  query.equalTo(DB.STUDENT.BOT_ID, botId).equalTo(DB.STUDENT.USER_ID, userId).find({
    success(results) {
      if (results.length === 0) {
        Student.save({
          [DB.STUDENT.BOT_ID]: botId,
          [DB.STUDENT.USER_ID]: userId,
          [DB.STUDENT.POINT]: point
        });
      }
      results[0].increment(DB.STUDENT.POINT, point);
      results[0].save();
    },
    error(error) {
      console.log(error.message);
    }
  });
}

module.exports = awardPoints;
