const { DB } = require('../word');

async function replyWithGithub(originalMessage) {
  const point = 1;
  if (originalMessage.attachments[0].pretext !== undefined) {
    if (originalMessage.attachments[0].pretext.indexOf('New comment by ') > -1) {
      const gitUser = originalMessage.attachments[0].pretext.split('New comment by ')[1].split(' ')[0];

      const Student = new Parse.Object(DB.STUDENT.CALL);
      const query = new Parse.Query(Student);
      query.equalTo(DB.STUDENT.BOT_ID, this.id).equalTo(DB.STUDENT.GITHUB_NAME, gitUser);
      try {
        const record = await query.first();
        if (record !== undefined) {
          record.increment(DB.STUDENT.POINT, point);
          record.save();
        }
      } catch (err) {
        console.error('DATABASE ERROR', err);
      }
    }
  }
}

module.exports = replyWithGithub;
