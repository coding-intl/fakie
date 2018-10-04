const express = require('express');
const FakieClient = require('./FakieClient');

module.exports = class FakieServer {
  constructor(config) {
    this.client = new FakieClient(config);
    this.router = FakieServer.createRouter(this.client)
  }

  static createRouter(client) {
    const router = new express.Router();
    router.all('*', (request, response) => {
      const result = client.fetchSync(request.url, {method: request.method, body: request.body}, true);
      if(result) {
        return response.json(result);
      }
      else {
        return response.status(404).json({error: 'No fake data found!'});
      }
    });

    return router;
  }

  listen(port = 8111) {
    this.app = express();
    this.app.use('/', this.router);
    this.app.listen(port, this.host);

    console.log('Fakie running at http://localhost:'+port);
  }
};