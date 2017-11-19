const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const favicon = require('serve-favicon');

// parse dashboard
const ParseDashboard = require('parse-dashboard');

class ServerInstance {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new Promise((resolve) => {
      const { settings } = this;
      const port = settings.port || 55555;
      const app = express();
      app.use(favicon(path.resolve(__dirname, '../public', 'favicon-32.png')));

      // Proxy to API server
      const targetUrl = 'http://localhost:' + (process.env.PARSE_PORT || 1337);
      const proxy = httpProxy.createProxyServer({
        target: targetUrl,
        ws: true
      });

      proxy.on('upgrade', function (req, socket, head) {
        proxy.ws(req, socket, head);
      });

      app.use('/api', (req, res) => {
        proxy.web(req, res, { target: targetUrl });
      });

      // parse dashboard
      const dashboard = new ParseDashboard({
        apps: [
          {
            serverURL: settings.serverURL || 'http://localhost:1337/parse',
            appId: settings.appId || 'myAppId',
            masterKey: settings.masterKey || 'masterKey',
            appName: 'dumbledore',
          }
        ],
        users: [
          {
            user: settings.user || 'parseapp',
            pass: settings.pass || 'parsepassword'
          }
        ],
        trustProxy: 1
      });

      // make the Parse dashboard available at /dashboard
      app.use('/dashboard', dashboard);

      app.use(express.static(path.join(__dirname, '..', 'public')));

      app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
      });
      this.server = app.listen(port, () => {
        console.log('web-server running on port ' + port + '.');
        console.log('parse-dashboard on ' + port + '/dashboard');
        resolve();
      });
    });
  }
}

module.exports = ServerInstance;
