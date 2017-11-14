describe('bot', function () {
  const Dumbledore = require('../lib/dumbledore');
  const { atob } = require('../lib/helper/common');
  const { DB } = require('../lib/const');

  /*
  const fake = {
    type: 'message',
    channel: 'C7A6B2CHF',
    user: 'U7B970DBR',
    text: '2 points to <@U7B970DBR>',
    ts: '1510373263.000063',
    source_team: 'T7B8QKJ8P',
    team: 'T7B8QKJ8P'
  };
  */

  beforeAll(() => {
    Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
    Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
  });

  it('should be able to launch', (done) => {
    const name = process.env.BOT_NAME;
    let token = process.env.BOT_API_KEY;
    if (token.length > 42) token = atob(token);

    const obj = new Parse.Object(DB.BOT.CALL);
    obj.save({
      [DB.BOT.BOT_NAME]: name,
      [DB.BOT.BOT_API_KEY]: token
    }).then(o => {
      return new Dumbledore({ token, name, id: o.id });
    }).then(dumbledore => {
      dumbledore.run().then(() => {
        // load bot succesful
        expect(dumbledore.user.name).toEqual(process.env.BOT_NAME);
        done();
      }, () => {
        fail('should not fail');
        done();
      });
    });
  });
});
