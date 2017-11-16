const Parse = require('parse/node');
const { DB, OUTPUT } = require('../const');

async function awardPoints(message) {
  const fromUser = await this.convertToUserName(message.user);
  let point = 0;
  let userId = '';
  const botName = this.name;

  if (this.isReactionEvent(message)) {
    point = 10;
    userId = message.item_user;
  } else if (this.isChatMessageEvent(message)) {
    userId = ([(message.text.substring(message.text.indexOf('@') + 1).split('>')[0])]).join();
    point = parseInt(message.text.split(' ')[0].replace(/[^\d.]/g, ''), 10);
  }
  const userName = await this.convertToUserName(userId);
  // const user = message.item_user;
  if (typeof botName === 'undefined' || typeof userId === 'undefined' || typeof point === 'undefined') return;
  if (userName === botName) return this.slackBot.awardPointsCallback(message, OUTPUT.FAIL_POINT_TO);
  const Student = new Parse.Object(DB.STUDENT.CALL);
  const query = new Parse.Query(Student);
  query.equalTo(DB.STUDENT.BOT_ID, this.id);
  query.equalTo(DB.STUDENT.USER_ID, userId);

  const secodQuery = new Parse.Query(Student);
  secodQuery.equalTo(DB.STUDENT.BOT_ID, this.id);
  secodQuery.equalTo(DB.STUDENT.USER_ID, message.user);

  try {
    const results = await query.first();
    const results2 = await secodQuery.first();

    if (this.isChatMessageEvent(message)) {
      if (results2.attributes.point >= point) {
        results.increment(DB.STUDENT.POINT, point);
        results.save();
        results2.increment(DB.STUDENT.POINT, -point);
        results2.save();
        this.slackBot.awardPointsCallback(message, OUTPUT.pointTo(results.attributes, point, fromUser.name));
      } else {
        this.slackBot.announcePlainString(message, OUTPUT.WHENZERO);
      }
    } else if (this.isReactionEvent(message)) {
      results.increment(DB.STUDENT.POINT, point);
      results.save();
      this.slackBot.reactionPointsCallback(message, OUTPUT.reaction(results.attributes, point, fromUser.name));
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = awardPoints;
