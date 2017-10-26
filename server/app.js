const express = require('express');
const path = require('path');

class ServerInstance {
  constructor(settings) {
    this.settings = settings;
  }

  create() {
    return new Promise((resolve, reject) => {
      const { settings } = this;
      const port = settings.port || 55555;
      const app = express();

      app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
      });
      this.server = app.listen(port, () => {
        console.log('server run...' + port + '.');
        resolve();
      });
    })      
  }    
}

module.exports = ServerInstance;
