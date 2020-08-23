var seconds = 00;
var minutes = 00;
var hours = 00;
var Interval;

function createRandomString(length) {
  var str = "";
  for ( ; str.length < length; str += Math.random().toString(36).substr(2));
  return str.substr(0, length);
}


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).attr('data-clipboard-text')).select();
  document.execCommand("copy");
  $temp.remove();
}

$(function () {
	$('#generate-link').on('click', function(e){
    var str = createRandomString(7);
    var roomUrl = window.location.href + 'rooms/'+str;
    $('.copy-link').attr('data-clipboard-text', roomUrl);
    $('.go-to-room').attr('data-redirect-url', roomUrl);
    $(this).hide();
    $('.room-created').fadeIn(1000);
    return false;
  });

  $('.copy-link').on('click', function(e){
    $('.copy-link').text('Copied!');
    copyToClipboard($(this));
  });

  $('.go-to-room').on('click', function(e){
    window.location.href = $(this).data('redirect-url');
  });

});




