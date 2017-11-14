const ParseInstance = require('../../parse-server/parse');
const Parse = require('parse/node');

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
      // parse js sdk
      Parse.initialize(process.env.APP_ID || 'myAppId', null, process.env.MASTER_KEY || 'masterKey');
      Parse.serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

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

      server.create().then(() => {
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
