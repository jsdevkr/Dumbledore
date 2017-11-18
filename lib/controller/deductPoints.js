const Parse = require('parse/node');
const { DB, OUTPUT } = require('../const');

async function deductPoints(message) {
  const fromUser = await this.convertToUserName(message.user);
  const botName = this.name;
  let point = 0;
  let userId = '';

  if (this.isReactionEvent(message)) {
    point = 10;
    userId = message.item_user;
  }

  const userName = await this.convertToUserName(userId);

  if (typeof botName === 'undefined' || typeof userId === 'undefined' || typeof point === 'undefined') return;
  if (userName === botName) return this.slackBot.reactionCancelCallback(message, OUTPUT.FAIL_POINT_TO);

  const Student = new Parse.Object(DB.STUDENT.CALL);
  const query = new Parse.Query(Student);
  query.equalTo(DB.STUDENT.BOT_ID, this.id);
  query.equalTo(DB.STUDENT.USER_ID, userId);

  try {
    const results = await query.first();

    if (this.isReactionEvent(message)) {
      if (results.attributes.point <= 0) {
        return this.slackBot.reactionCancelCallback(message, OUTPUT.cancelWhenzero(results.attributes));
      }
      results.increment(DB.STUDENT.POINT, -point);
      results.save();
      this.slackBot.reactionCancelCallback(message, OUTPUT.reactionCancel(results.attributes, point, fromUser.name, message.reaction));
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = deductPoints;
