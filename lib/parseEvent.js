const { INPUT } = require('./word');
const awardPoints = require('./controller/awardPoints');
const deductPoints = require('./controller/deductPoints');
const replyWithDumbledore = require('./controller/replyWithDumbledore');

 function parseMessage(message) {
  /* todo: what if handle multiple messages? */
  const text = message.text.toLowerCase();

  if(text.includes(INPUT.POINT_TO)) {
    awardPoints.call(this, message);
  } else if(text.includes(INPUT.POINT_FROM)) {
    deductPoints.call(this, message);
  } else if(text.includes(INPUT.PROFESSOR) || text.includes(this.name)) {
    replyWithDumbledore.call(this, message);
  } else if(message.channel != null && message.channel === this.githubChannel) {
    
  }
}

module.exports = parseMessage;