const ParseInstance = require('../../parse-server/parse');
const Parse = require('parse/node');
const Dumbledore = require('../../lib/dumbledore');
const { DB } = require('../../lib/word');
const { atob } = require('../../lib/helper/common');

jasmine.DEFAULT_TIMEOUT_INTERVAL = process.env.PARSE_SERVER_TEST_TIMEOUT || 5000;

let server;

function createServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      return server.close(() => {
        server = undefined;
        createServer().then(resolve, reject);
      });
    }

    try {
      server = new ParseInstance({
        databaseURI: process.env.DATABASE_URI,
        cloud: process.env.CLOUD_CODE_MAIN,
        appId: process.env.APP_ID,
        masterKey: process.env.MASTER_KEY,
        serverURL: process.env.SERVER_URL,
        port: process.env.PORT,
        mountPath: process.env.MOUNT_PATH,
        user: process.env.ADMIN_NAME,
        pass: process.env.ADMIN_PASS,
      });

      server.create().then(async () => {
        // parse js sdk
        Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
        Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

        const query = new Parse.Query(DB.BOT.CALL);
        const botCount = await query.count();

        if (!botCount) {
          const name = process.env.BOT_NAME;

          // base64 encoded token
          let token = process.env.BOT_API_KEY;
          if (token.length > 42) token = atob(token);

          const obj = new Parse.Object(DB.BOT.CALL);
          await obj.save({
            [DB.BOT.BOT_NAME]: name,
            [DB.BOT.BOT_API_KEY]: token
          });
        }

        // dumbledore bot
        query.first({
          success(res) {
            this.dumbledore = new Dumbledore({
              token: res.get(DB.BOT.BOT_API_KEY),
              name: res.get(DB.BOT.BOT_NAME)
            });
          }
        });

        resolve();
      }, reject);
    } catch (error) {
      reject(error);
    }
  });
}

beforeEach((done) => {
  if (server) return done();
  createServer().then(done, done.fail);
});
