var seconds = 00;
var minutes = 00;
var hours = 00;
var Interval;


$(function () {
  var socket = io();
  var room = location.href.substring(location.href.lastIndexOf('/') + 1);
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

  /*  
    Stopwatch code starts here
  */


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

  /*  
    Stopwatch code ends here
  */

  /*  
    Create note code starts here
  */
  $("#create-note").click(function() {
    $(this).before("<textarea></textarea>");
  });

  /*  
    Create note JS code ends here
  */

});

function start() {
  console.log("start called")
  clearInterval(Interval);
  Interval = setInterval(startTimer, 1000);
}

function stop() {
  console.log("stop called")
  clearInterval(Interval);
}

function reset() {
  clearInterval(Interval);
  hours = seconds = minutes = 0
  $('#hours').html("00");
  $('#minutes').html("00");
  $('#seconds').html("00");
}

function startTimer() {
  seconds++;
  if (seconds == 60) {
      seconds = 0;
      minutes++;
    secondsString = "00"
  }
  else if (seconds < 10) {
    secondsString = "0" + seconds  
  }
  else {
    secondsString = seconds
  }


  if(minutes < 10) {
      minutesString = "0" + minutes 
  }
  else if(minutes == 60) {
      hours++;
      minutes = 0;
      minutesString = "00"
  }   
  else {
      minutesString = minutes 
  }


  if(hours < 10) {
      hoursString = "0" + hours
  } 
  else {
      hoursString = hours
  }
  $('#hours').html(hoursString);
  $('#minutes').html(minutesString);
  $('#seconds').html(secondsString);
}
