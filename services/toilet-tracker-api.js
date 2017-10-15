const request = require('request');

function postCurrentStatus(isBusy) {
  const messageData = ({
    "data": {
      "type": "wcstatuses",
      "attributes": {
        "is-busy": isBusy
      }
    }
  });

  request({
    uri: 'http://745702d8.ngrok.io/wcstatuses',
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("Successfully sent message");
    } else {
      console.error("Unable to send message.");
      console.error(error);
    }
  });
}

module.exports.postCurrentStatus = postCurrentStatus;