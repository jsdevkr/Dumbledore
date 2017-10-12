const slackBot = require('../helper/slackBot');
const { INPUT } = require('../word');

async function helpMessage(originalMessage) {
  const { POINTS_TO, POINTS_FROM, PROFESSOR } = INPUT;

  // for points to
  const pointTo = `\`Num\` ${POINTS_TO.CALL} \`house name\``;
  await slackBot.announcePlainString(originalMessage, pointTo, this);

  // for points from
  const pointFrom = `\`Num\` ${POINTS_FROM.CALL} \`house name\``;
  await slackBot.announcePlainString(originalMessage, pointFrom, this);

  // for professor
  // todo: show details
  Object.keys(PROFESSOR).forEach(async k => {
    if (k !== 'CALL') {
      const str = `\`${PROFESSOR.CALL}\` or \`${slackBot.getName()}\` ${typeof PROFESSOR[k] === 'object' ? PROFESSOR[k].CALL : PROFESSOR[k]}`;

      await slackBot.announcePlainString(originalMessage, str, this);
    }
  });
}

module.exports = helpMessage;
