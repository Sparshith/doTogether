var seconds = 00;
var tens = 00;
var Interval;


$(function () {
  var socket = io();
  var room = "nixiespar";
  socket.on('connect', function() {
    socket.emit('room', room);
  });


  socket.on('connect', function() {
    socket.emit('room', room);
  });

  socket.on('timerEvent', function(eventType){
    switch(eventType) {
      case 'start':
        start();
        break;
      case 'stop':
        stop();
        break;
      case 'reset':
        reset();
        break;
    }
  });


  $('#button-start').on('click', function(e){
    socket.emit('timerEvent', 'start');
    start();
    return false
  });

  $('#button-stop').on('click', function(e){
    socket.emit('timerEvent', 'stop');
    stop();
    return false;
  });

  $('#button-reset').on('click', function(e){
    reset();
    socket.emit('timerEvent', 'reset');
    return false;
  });

});

function start() {
  console.log("start called")
  clearInterval(Interval);
  Interval = setInterval(startTimer, 10);
}

function stop() {
  console.log("stop called")
  clearInterval(Interval);
}

function reset() {
  clearInterval(Interval);
  tens = "00";
  seconds = "00";
  $('#tens').html(tens);
  $('#seconds').html(seconds);
}

function startTimer() {
  tens++;
  if (tens < 9) {
    $('#tens').html("0" + tens);
  }
  if (tens > 9) {
    $('#tens').html(tens);
  }
  if (tens > 59) {
    seconds++;
    $('#seconds').html("0" + seconds);
    tens = 0;
    $('#tens').html("0" + 0);
  }
  if (seconds > 9) {
    $('#seconds').html(seconds);
  }
}


