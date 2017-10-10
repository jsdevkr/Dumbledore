function replyWithGithub(originalMessage) {
  if (originalMessage.attachments[0].pretext !== undefined) {
    if (originalMessage.attachments[0].pretext.indexOf('New comment by ') > -1) {
      const gitUser = originalMessage.attachments[0].pretext.split('New comment by ')[1].split(' ')[0];

      if (originalMessage.attachments[0].text.indexOf(':+1:') > -1) {
        this.db.get('SELECT * FROM students WHERE github_name = ?', gitUser, function (err, record) {
          if (err) {
            return console.error('DATABASE ERROR', err);
          } if (record !== undefined) {
            this.db.run('UPDATE students SET points_earned = (points_earned + ?) WHERE user_id = ?', 5, record.user_id);
            this.db.run('UPDATE houses SET points = points + ? WHERE house = ?', 5, record.house);
          }
        });
      }
    }
  }
}

module.exports = replyWithGithub;
