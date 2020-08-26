var seconds = 00;
var minutes = 00;
var hours = 00;
var Interval;
var room = location.href.substring(location.href.lastIndexOf('/') + 1);

/*
  Stopwatch sync code starts here
*/

window.onload = function() {
  var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  var storedTime = JSON.parse(localStorage.getItem(room + "_curtime"));
  var storedState = localStorage.getItem(room + "_state")
  syncTimeOnReload(storedTime, Math.round(loadTime/1000), storedState);
};

function back() {
  window.location.href = '/'
}


function syncTimeOnReload(storedTime, loadTime, storedState) {
  if(!storedTime) return;
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

  socketHandlers(socket);

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
    Sticky note code starts here
  */
  $("#create-note").click(function() {
    var noteId = $('.sticky-note').length + 1;
    addNote(socket, noteId);
    var noteEventMessage = {
      type: "noteAdded",
      noteId: noteId,
    }
    socket.emit('noteEvent', JSON.stringify(noteEventMessage));
  });

  refreshNotesJS(socket);
  loadNotesFromLocalStorage(socket);
  /*  
    Sticky note  code ends here
  */
});


function addNote(socket, noteId) {
  $('#create-note').before("<div class='text'><div contenteditable='true' class='sticky-note' data-note-id='"+ noteId +"'></div><button onclick='deleteNotes($(this))' class='close'><span class='material-icons'>delete</span></button></div>");
  refreshNotesJS(socket);
}

function getNotesKey() {
  return room + "_" + "notes";
}

function addNoteToLocalStorage(noteId, text) {
  var notes = localStorage.getItem(getNotesKey());
  if(!notes) {
    notes = {};
  } else {
    notes = JSON.parse(notes);
  }
  notes[noteId] = text;
  localStorage.setItem(getNotesKey(), JSON.stringify(notes));
}

function loadNotesFromLocalStorage(socket) {
  var notes = JSON.parse(localStorage.getItem(getNotesKey()));
  if(!notes) {
    var noteId = 1;
    var text = 'This is a sticky note you can type and edit.';
    addTextToNote(noteId, text);
    addNoteToLocalStorage(noteId, text);
    return;
  }

  for (var noteId in notes) {
    if (notes[noteId] == null) continue;
    if (notes.hasOwnProperty(noteId)) {
      var text = notes[noteId];
      if ($('.sticky-note[data-note-id="'+ noteId +'"]').length > 0) {
        addTextToNote(noteId, text);
      } else {
        addNote(socket, noteId);
        addTextToNote(noteId, text);
      }
    }
  }
}


function socketHandlers(socket) {
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

  socket.on('noteEvent', function(encodedNoteEventMessage) {
    var noteEventMessage = JSON.parse(encodedNoteEventMessage);
    switch (noteEventMessage['type']) {
      case 'noteAdded':
        addNote(socket, noteEventMessage['noteId']);
        break;
      case 'textChanged':
        addTextToNote(noteEventMessage['noteId'], noteEventMessage['text']);
        addNoteToLocalStorage(noteEventMessage['noteId'], noteEventMessage['text']);
        break;
    }
  });
}

function addTextToNote(noteId, text) {
  $('.sticky-note[data-note-id="'+ noteId +'"]').html(text);
}

function refreshNotesJS(socket) {
  $(".sticky-note").on('input', function() {
    var noteId = $(this).data('note-id');
    var text = $(this).html();
    addNoteToLocalStorage(noteId, text);
    var noteEventMessage = {
      type: "textChanged",
      noteId: noteId,
      text: text,
    }
    socket.emit('noteEvent', JSON.stringify(noteEventMessage));
  });
}

function deleteNotes(thisObj) {
  addNoteToLocalStorage(thisObj.siblings().data('note-id'), null);
  var parent = thisObj.parent();
  thisObj.remove();
  parent.remove();
}

function start() {
  clearInterval(Interval);
  Interval = setInterval(startTimer, 1000);
  localStorage.setItem(room + "_state", "started");
}

function stop() {
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


/* 
 Function to prevent outlines on mousedown but keep it on keydown
*/

(function(document, window){
  if (!document || !window) {
    return;
  }
  
  var styleText = '::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;';
  var unfocus_style = document.createElement('STYLE');

  window.unfocus = function(){
    document.getElementsByTagName('HEAD')[0].appendChild(unfocus_style);

    document.addEventListener('mousedown', function(){
      unfocus_style.innerHTML = styleText+'}';
    });
    document.addEventListener('keydown', function(){
      unfocus_style.innerHTML = '';
    });
  };

  unfocus.style = function(style){
    styleText += style;
  };

  unfocus();
})(document, window);



