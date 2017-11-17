describe('In controller', () => {
  const Dumbledore = require('../lib/dumbledore');
  const { atob } = require('../lib/helper/common');
  const { DB } = require('../lib/const');
  let dumbledore;

  const fake = {
    type: 'message',
    channel: 'C7A6B2CHF',
    user: 'U7B970DBR',
    text: '',
    ts: '1509022008.000293',
    source_team: 'T7B8QKJ8P',
    team: 'T7B8QKJ8P',
    botId: 'U7A7U47CZ',
    userName: 'cilpong'
  };

  beforeAll(() => {
    Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
    Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

    const name = process.env.BOT_NAME;
    let token = process.env.BOT_API_KEY;
    if (token.length > 42) token = atob(token);

    dumbledore = new Dumbledore({ token, name, id: fake.botId });
  });

  it('Any functions should not be `undefined` in dumbledore', () => {
    expect(dumbledore.awardPoints).toBeDefined();
    expect(dumbledore.convertToUserName).toBeDefined();
    expect(dumbledore.getUser).toBeDefined();
    expect(dumbledore.helpMessage).toBeDefined();
    expect(dumbledore.replyWithDumbledore).toBeDefined();
    expect(dumbledore.replyWithGithub).toBeDefined();
  });

  it('dumbledore should convert to user name', (done) => {
    dumbledore.convertToUserName(fake.user).then((res) => {
      expect(res).not.toBe(false);
      done();
    });
  });

  it('dumbledore should say help message', (done) => {
    let check = false;
    fake.text = 'help';

    dumbledore.helpMessage(fake).then(() => {
      try {
        check = true;
      } catch (err) {
        console.log(err);
      }
      expect(check).toBe(true);
      done();
    });
  });

  it('dumbledore should award points and set it in parse object', async (done) => {
    fake.text = '10 points to <@U7B970DBR>';

    const testUser = new Parse.Object(DB.STUDENT.CALL);
    testUser.save({
      [DB.STUDENT.BOT_ID]: fake.botId,
      [DB.STUDENT.USER_ID]: fake.user,
      [DB.STUDENT.USER_NAME]: fake.userName,
      [DB.STUDENT.POINT]: 0
    });

    try {
      const point = parseInt(fake.text.split(' ')[0].replace(/[^\d.]/g, ''), 10);
      const testQuery = new Parse.Query(testUser);
      testQuery.equalTo(DB.STUDENT.USER_ID, fake.user);

      const fir = await testQuery.first();
      fir.increment(DB.STUDENT.POINT, point);
      fir.save();

      expect(fir.get(DB.STUDENT.POINT)).toEqual(point);
      done();
    } catch (err) {
      console.log(err);
      done();
    }
  });
});
