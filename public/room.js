var seconds = 00;
var minutes = 00;
var hours = 00;
var Interval;
var room;

/*
  Stopwatch sync code starts here
*/

window.onload = function() {
  room = location.href.substring(location.href.lastIndexOf('/') + 1);
  var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  var storedTime = JSON.parse(localStorage.getItem(room + "_curtime"));
  var storedState = localStorage.getItem(room + "_state")
  syncTimeOnReload(storedTime, Math.round(loadTime/1000), storedState)
};


function syncTimeOnReload(storedTime, loadTime, storedState) {
  hours = storedTime[0];
  minutes = storedTime[1];
  seconds = storedTime[2] + loadTime; 
  if (storedState == "started") start();
  else if (storedState == "stopped") stop();
  else reset();
  parseTime(hours, minutes, seconds)
}

function parseTime(hours,minutes,seconds) {
  (hours < 10) ? hoursString = "0" + hours : hoursString = hours;
  (minutes < 10) ? minutesString = "0" + minutes : minutesString = minutes;
  (seconds < 10) ? secondsString = "0" + seconds : secondsString = seconds;
  $('#hours').html(hoursString);
  $('#minutes').html(minutesString);
  $('#seconds').html(secondsString);
}

/*
  Stopwatch sync code ends here
*/


$(function () {
  var socket = io();
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
  localStorage.setItem(room + "_state", "started");
}

function stop() {
  console.log("stop called")
  clearInterval(Interval);
  localStorage.setItem(room + "_state", "stopped");
}

function reset() {
  clearInterval(Interval);
  hours = seconds = minutes = 0
  $('#hours').html("00");
  $('#minutes').html("00");
  $('#seconds').html("00");
  localStorage.setItem(room + "_state", "reset");
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

  var timeElapsed = [hours, minutes, seconds]
  localStorage.setItem(room + "_curtime", JSON.stringify(timeElapsed));


  $('#hours').html(hoursString);
  $('#minutes').html(minutesString);
  $('#seconds').html(secondsString);
}
