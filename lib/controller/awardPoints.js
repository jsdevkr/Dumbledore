const Parse = require('parse/node');
const { DB } = require('../word');

function awardPoints(botId, userId, score) {
  if (typeof botId === 'undefined' || typeof userId === 'undefined' || typeof score === 'undefined') return;
  const Contributor = new Parse.Object('Contributor');
  const query = new Parse.Query(Contributor);
  query.equalTo(DB.CONTRIBUTOR.BOT_ID, botId).equalTo(DB.CONTRIBUTOR.USER_ID, userId).find({
    success(results) {
      console.log(results);
      if (results.length === 0) {
        Contributor.set(DB.CONTRIBUTOR.BOT_ID, botId);
        Contributor.set(DB.CONTRIBUTOR.USER_ID, userId);
        Contributor.set(DB.CONTRIBUTOR.SCORE, score);

        Contributor.save();
      }
      results[0].increment(DB.CONTRIBUTOR.SCORE, score);
      results[0].save();
    },
    error(error) {
      console.log(error.message);
    }
  });
}

module.exports = awardPoints;
