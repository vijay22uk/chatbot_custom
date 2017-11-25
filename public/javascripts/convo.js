var botui = new BotUI('api-bot');

var socket = io.connect();
// read the BotUI docs : https://docs.botui.org/
socket.on('fromServer', function (data) { // recieveing a reply from server.
  if (data.loginRequest) {
    botui.action.button({
      delay: 4000,
      loading: true,
      autoHide: false,
      addMessage: false,
      action: [{
        icon: 'check',
        text: 'Login',
        value: 'l'
      }, {
        icon: 'user-secret',
        cssClass: 'continue-class',
        text: 'continue',
        value: 'c'
      }]
    }).then(handleLogin)
  } else if (data.action === 'reports_done') {
    botui.message.add({
      cssClass: 'open-reports',
      content: data.server,
      delay: 3000,
      loading: true
    }).then(again);
  }
  else {
    botui.message.add({
      loading: true,
      content: data.server,
      delay: 500,
    }).then(again);
  }
});
function handleLogin(res) {
  if (res.value === 'l') {
    //alert('Login Now');
    window.location = '/login'
  } else {
    again();
  }
}
function again() {
  botui.action.text({
    action: {
      cssClass: 'microphile',
      icon: 'microphone',
      placeholder: 'Type ..',
    }
  }
  ).then(function (res) {
    socket.emit('fromClient', { client: res.value, isLogedIn: window.isLogedIn });
  })
}

botui.message.add({
  content: 'Lets Start Talking...',
  delay: 1500,
}).then(function () {
  botui.action.text({
    action: {
      icon: 'microphone',
      placeholder: 'Say Hello',
    }
  }
  ).then(function (res) {
    socket.emit('fromClient', { client: res.value, isLogedIn: window.isLogedIn });
    console.log(res.value);
  })
});

// main
$(document).ready(init);
function init() {
  $(document).on('click', '.open-reports', function () {
    $('#infoModal').modal('show');
  });
  $(document).on('click', '.fa-microphone', function () {
    recognition.start();
    $('.microphone-overlay').show();
  });
  $('.microphone-overlay').on('click', function () {
    recognition.stop();
    $('.microphone-overlay').hide();
  })
  // speech 
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;


  recognition.addEventListener('result', (e) => {
    $('.microphone-overlay').hide();
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log('Confidence: ' + e.results[0][0].confidence);
    // We will use the Socket.IO here later…
    botui.message.add({
      human: true,
      loading: true,
      content: text,
      delay: 500,
    })
    socket.emit('fromClient', { client: text, isLogedIn: window.isLogedIn });
  });
}
