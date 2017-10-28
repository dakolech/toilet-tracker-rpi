const express = require('express');
const app = express();
const toiletTrackerAPI = require('./services/toilet-tracker-api');
const fs = require('fs');

app.get('/', function (req, res) {
  return res.redirect('/status?is-busy=true');
});

app.get('/status', function (req, res) {
  var data;
  if(req.query['is-busy'] === 'true') {
    data = fs.readFileSync('./templates/busy.html').toString();
  } else {
    data = fs.readFileSync('./templates/available.html').toString();
  }
  res.send(data);
  toiletTrackerAPI.postCurrentStatus(req.query['is-busy'] === 'true');
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log(data);
  res.sendStatus(200);
});

