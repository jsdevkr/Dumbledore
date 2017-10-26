describe('In helper', function () {
  const stringHandler = require('../lib/helper/stringHandler');
  const SlackBot = require('../lib/helper/slackBot');
  const { atob } = require('../lib/helper/common');
  let token = process.env.BOT_API_KEY;
  let bot = null;

  beforeAll(() => {
    if (token.length > 42) token = atob(token);
    bot = new SlackBot({ token, name: process.env.BOT_NAME });
  });

  it('First letter should be capitalized', () => {
    const first = stringHandler.capitalizeFirstLetter('letter').charCodeAt(0);
    let check = false;

    if (first < 91 && first > 64) check = true;

    expect(check).toBe(true);
  });

  it('Any functions should not be `undefined` in slackBot', () => {
    expect(bot.awardPointsCallback).toBeDefined();
    expect(bot.deductPointsCallback).toBeDefined();
    expect(bot.getAllHousePointsCallback).toBeDefined();
    expect(bot.announcePlainString).toBeDefined();
    expect(bot.getUserList).toBeDefined();
    expect(bot.getName).toBeDefined();
  });
});
