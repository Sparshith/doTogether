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