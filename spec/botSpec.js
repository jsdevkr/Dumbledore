describe('bot', function () {
  // const Dumbledore = require('../lib/dumbledore');
  // const { atob } = require('../lib/helper/common');


  it('test', () => {
    this.dumbledore.run().then(() => {
      console.log('Start *Dumbledore bot* for testing.');
    }, console.error);
  });
/*  it('should be able to launch', (done) => {
    // base64 encoded token
    let token = process.env.BOT_API_KEY;
    if (token.length > 42) token = atob(token);

    const dumbledore = new Dumbledore({
      token,
      dbPath: process.env.BOT_DB_PATH,
      name: process.env.BOT_NAME,
      githubChannel: process.env.BOT_GITHUB_CHANNEL_ID
    });

    dumbledore.run().then(() => {
      // load bot succesful
      expect(dumbledore.user.name).toEqual(process.env.BOT_NAME);
      done();
    }, () => {
      fail('should not fail');
      done();
    });
  });
  */
});
