var seconds = 00;
var minutes = 00;
var hours = 00;
var Interval;

function createRandomString(length) {
    var str = "";
    for ( ; str.length < length; str += Math.random().toString(36).substr(2));
    return str.substr(0, length);
}

$(function () {
	$('#generate-link').on('click', function(e){
		console.log("here")
    var str = createRandomString(7);
    var link = jQuery('<a>').attr('href', '/rooms/'+str).text('Click here to go to your doTogetheroom')
    $("#output").html(link)
    return false;
  });

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

