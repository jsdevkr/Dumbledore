describe('bot', function () {
  const Dumbledore = require('../lib/dumbledore');

  it('should be able to launch', (done) => {
    const dumbledore = new Dumbledore({
      token: process.env.BOT_API_KEY,
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
});
