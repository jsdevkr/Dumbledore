describe('In controller', () => {
  const Dumbledore = require('../lib/dumbledore');
  const { atob } = require('../lib/helper/common');
  let dumbledore;

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
    let token = process.env.BOT_API_KEY;
    if (token.length > 42) token = atob(token);

    dumbledore = new Dumbledore({ token, name: process.env.BOT_NAME });
  });

  it('should convert to user name', () => {
    dumbledore.convertToUserName(fake.user).then((res) => {
      expect(res).not.toBe(false);
    });
  });
});
