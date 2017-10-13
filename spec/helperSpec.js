describe('In helper', function () {
  const stringHandler = require('../lib/helper/stringHandler');
  const slackBot = require('../lib/helper/slackBot');

  it('First letter should be capitalized', () => {
    expect(stringHandler.capitalizeFirstLetter('letter')).toBe('Letter');
  });

  it('Any functions should not be `undefined` in slackBot', () => {
    expect(slackBot.explainSorting).toBeDefined();
    expect(slackBot.awardPointsCallback).toBeDefined();
    expect(slackBot.deductPointsCallback).toBeDefined();
    expect(slackBot.getAllHousePointsCallback).toBeDefined();
    expect(slackBot.announcePlainString).toBeDefined();
  });
});
