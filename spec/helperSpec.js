describe('In helper', function () {
  const SlackBot = require('../lib/helper/slackBot');
  const { atob, capitalizeFirstLetter } = require('../lib/helper/common');
  const { OUTPUT } = require('../lib/const');
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
    const first = capitalizeFirstLetter('letter').charCodeAt(0);
    let check = false;

    if (first < 91 && first > 64) check = true;

    expect(check).toBe(true);
  });

  it('Any functions should not be `undefined` in slackBot', () => {
    expect(slackBot.awardPointsCallback).toBeDefined();
    expect(slackBot.announcePlainString).toBeDefined();
    expect(slackBot.getUserList).toBeDefined();
    expect(slackBot.getName).toBeDefined();
  });

  it('Slack bot should say hello', (done) => {
    let check = false;

    slackBot.announcePlainString(fake, OUTPUT.SAY_HELLO).then(() => {
      try {
        check = true;
      } catch (err) {
        console.error(err);
      }
      expect(check).toBe(true);
      done();
    });
  });

  it('Slack bot should get its own name', () => {
    expect(slackBot.getName()).toEqual(process.env.BOT_NAME);
  });

  it('Slack bot should get user list', (done) => {
    slackBot.getUserList().then((o) => {
      let check = false;

      if (o !== undefined) {
        check = true;
      }

      expect(check).toBe(true);
      done();
    });
  });
});
