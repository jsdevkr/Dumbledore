// parse server
const express = require('express');
const { ParseServer } = require('parse-server');
const path = require('path');
const { DB } = require('../lib/const');

class ParseInstance {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new Promise((resolve, reject) => {
      try {
        const { settings } = this;

        // express
        const app = express();

        // Serve static assets from the /public folder
        // app.use('/public', express.static(path.join(__dirname, '../public')));

        // parse server
        const api = new ParseServer({
          databaseURI: settings.databaseURI || 'mongodb://localhost/test',
          cloud: settings.cloud || path.join(__dirname, '/cloud/main.js'),
          appId: settings.appId || 'myAppId',
          masterKey: settings.masterKey || 'masterKey', // Add your master key here. Keep it secret!
          serverURL: settings.serverURL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
          liveQuery: {
            classNames: [DB.STUDENT.CALL] // List of classes to support for query subscriptions
          }
        });

        // Serve the Parse API on the /parse URL prefix
        const mountPath = settings.MOUNT_PATH || '/parse';
        app.use(mountPath, api);

        // Parse Server plays nicely with the rest of your web routes
        app.get('/', function (req, res) {
          res.status(200).send('Make sure to star the parse-server repo on GitHub!');
        });

        const port = settings.port || 1337;

        const httpServer = require('http').createServer(app);

        this.server = httpServer.listen(port, function () {
          console.log('parse-server running on port ' + port + '.');
          resolve();
        });

        ParseServer.createLiveQueryServer(httpServer);
      } catch (error) {
        reject(error);
      }
    });
  }

  close() {
    if (!this.server) return Promise.resolve();
    return this.server.close();
  }
}

module.exports = ParseInstance;
