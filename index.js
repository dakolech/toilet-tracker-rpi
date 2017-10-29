const express = require('express');
const app = express();
const toiletTrackerAPI = require('./services/toilet-tracker-api');
const fs = require('fs');
const rpio = require('rpio');

var previousLightState;
var statusUpdatesTimer;
//GPIO 17
rpio.open(11, rpio.INPUT, rpio.PULL_DOWN);

function pollcb(pin)
{
  /*
   * Interrupts aren't supported by the underlying hardware, so events
   * may be missed during the 1ms poll window.  The best we can do is to
   * print the current state after a event is detected.
   */
  const isLightOn = !rpio.read(pin);
  console.log('light is currently', isLightOn ? 'on' : 'off');
  if(previousLightState !== isLightOn) {
    statusUpdateDebouncer(isLightOn);
    previousLightState = isLightOn;
  }
}

rpio.poll(11, pollcb);


const statusUpdateDebouncer = function (status) {
  clearTimeout(statusUpdatesTimer);
  statusUpdatesTimer = setTimeout(function() {
    toiletTrackerAPI.postCurrentStatus(status)
  }, 1000)
};

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

