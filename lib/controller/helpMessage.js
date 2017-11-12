const { INPUT } = require('../const');

async function helpMessage(originalMessage) {
  const { POINTS_TO, POINTS_FROM, PROFESSOR } = INPUT;

  // for points to
  const pointTo = `\`Num\` ${POINTS_TO.CALL} \`house name\``;
  await this.slackBot.announcePlainString(originalMessage, pointTo);

  // for points from
  const pointFrom = `\`Num\` ${POINTS_FROM.CALL} \`house name\``;
  await this.slackBot.announcePlainString(originalMessage, pointFrom);

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
