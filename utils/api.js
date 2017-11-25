var apiai = require('apiai');
var app = apiai(process.env.key);
var getRes = function (query, id) {
  var request = app.textRequest(query, {
    sessionId: id || 'oneBot'
  });
  const responseFromAPI = new Promise(
    function (resolve, reject) {
      request.on('error', function (error) {
        reject(error);
      });
      request.on('response', function (response) {
        console.log(response);
        resolve({speech : response.result.fulfillment.speech, action : response.result.action, actionIncomplete: response.result.actionIncomplete});
      });
    });
  request.end();
  return responseFromAPI;
};

module.exports = { getRes }
