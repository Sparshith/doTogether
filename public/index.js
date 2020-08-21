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
    window.location.href = '/rooms/'+str
    console.log('/rooms/'+str)
    return false;
  });

});




