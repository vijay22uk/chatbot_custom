let io;
let authActions = ["reports_done","support.delivery","refund.request"];
var api = require('./api');
var conn = function (app, server) {
  io = require('socket.io')(server);
  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });
};

var fromClient = function () {
  io.on('connection', function (socket) {
    socket.on('fromClient', function (data) {
      api.getRes(data.client, socket.id).then(function (res) {
        if(!data.isLogedIn && authActions.indexOf(res.action) !==-1 && !res.actionIncomplete){
          socket.emit('fromServer', { server: null, loginRequest: true });
        }else{
          socket.emit('fromServer', { server: res.speech, action: res.action });
        }
        
      });
    });
  });
}
module.exports = { conn, fromClient }
