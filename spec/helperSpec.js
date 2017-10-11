describe('In helper', function () {
  const stringHandler = require('../lib/helper/stringHandler');
  const botCommand = require('../lib/helper/botCommand');

  it('First letter should be capitalized', () => {
    expect(stringHandler.capitalizeFirstLetter('letter')).toBe('Letter');
  });

  it('Any functions should not be `undefined` in botCommand', () => {
    expect(botCommand.explainSorting).toBeDefined();
    expect(botCommand.awardPointsCallback).toBeDefined();
    expect(botCommand.deductPointsCallback).toBeDefined();
    expect(botCommand.getAllHousePointsCallback).toBeDefined();
    expect(botCommand.announcePlainString).toBeDefined();
  });
});
