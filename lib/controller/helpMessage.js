const { INPUT } = require('../word');

async function helpMessage(originalMessage) {
  const { POINTS_TO, PROFESSOR } = INPUT;

  // for points to
  const pointTo = `\`Num\` ${POINTS_TO.CALL} \`@user\``;
  await this.slackBot.announcePlainString(originalMessage, pointTo);

  // for professor
  // todo: show details
  Object.keys(PROFESSOR).forEach(async k => {
    if (k !== 'CALL') {
      const str = `\`${PROFESSOR.CALL}\` or \`${this.slackBot.getName()}\` ${typeof PROFESSOR[k] === 'object' ? PROFESSOR[k].CALL : PROFESSOR[k]}`;

      await this.slackBot.announcePlainString(originalMessage, str);
    }
  });
}

module.exports = helpMessage;
