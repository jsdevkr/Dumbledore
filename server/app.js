const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');

class ServerInstance {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new Promise((resolve) => {
      const { settings } = this;
      const port = settings.port || 55555;
      const app = express();

      // Proxy to API server
      const targetUrl = 'http://localhost:' + (process.env.PARSE_PORT || 1337);
      const proxy = httpProxy.createProxyServer({
        target: targetUrl,
        ws: true
      });
      app.use('/api', (req, res) => {
        proxy.web(req, res, { target: targetUrl });
      });

      app.use(express.static(path.join(__dirname, '..', 'public')));

      app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
      });
      this.server = app.listen(port, () => {
        console.log('server run...' + port + '.');
        resolve();
      });
    });
  }
}

module.exports = ServerInstance;
