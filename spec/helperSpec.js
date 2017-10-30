describe('In helper', function () {
  const stringHandler = require('../lib/helper/stringHandler');
  const SlackBot = require('../lib/helper/slackBot');
  const { atob } = require('../lib/helper/common');
  const { INPUT, OUTPUT } = require('../lib/word.js');
  let token;
  let slackBot;

  const fake = {
    type: 'message',
    channel: 'C7A6B2CHF',
    user: 'U7B970DBR',
    text: '',
    ts: '1509022008.000293',
    source_team: 'T7B8QKJ8P',
    team: 'T7B8QKJ8P'
  };

  beforeAll(() => {
    token = process.env.BOT_API_KEY;
    if (token.length > 42) token = atob(token);

    slackBot = new SlackBot({ token, name: process.env.BOT_NAME });
  });

  it('First letter should be capitalized', () => {
    const first = stringHandler.capitalizeFirstLetter('letter').charCodeAt(0);
    let check = false;

    if (first < 91 && first > 64) check = true;

    expect(check).toBe(true);
  });

  it('Any functions should not be `undefined` in slackBot', () => {
    expect(slackBot.awardPointsCallback).toBeDefined();
    expect(slackBot.deductPointsCallback).toBeDefined();
    expect(slackBot.getAllHousePointsCallback).toBeDefined();
    expect(slackBot.announcePlainString).toBeDefined();
    expect(slackBot.getUserList).toBeDefined();
    expect(slackBot.getName).toBeDefined();
  });

  it('Bot should say hello', (done) => {
    let check = false;

    slackBot.announcePlainString(fake, OUTPUT.SAY_HELLO).then((r) => {
      check = true;
      expect(check).toBe(true);
      done();
    });
  });
});
