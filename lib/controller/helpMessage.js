const botCommand = require('../helper/botCommand');
const { INPUT } = require('../word');

async function helpMessage(originalMessage) {
  const { POINTS_TO, POINTS_FROM, PROFESSOR } = INPUT;

  // for points to
  const pointTo = `\`Num\` ${POINTS_TO.CALL} \`house name\``;
  await botCommand.announcePlainString(originalMessage, pointTo, this);

  // for points from
  const pointFrom = `\`Num\` ${POINTS_FROM.CALL} \`house name\``;
  await botCommand.announcePlainString(originalMessage, pointFrom, this);

  // for professor
  // todo: show details
  Object.keys(PROFESSOR).forEach(async k => {
    if (k !== 'CALL') {
      const str = `\`${PROFESSOR.CALL}\` or \`${this.name}\` ${typeof PROFESSOR[k] === 'object' ? PROFESSOR[k].CALL : PROFESSOR[k]}`;

      await botCommand.announcePlainString(originalMessage, str, this);
    }
  });
}

module.exports = helpMessage;
