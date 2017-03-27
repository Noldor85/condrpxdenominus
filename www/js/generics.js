
/*
	Generics
	
	
*/

function FormatInteger(num, length) {
			return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
		


function showInfoD(title,text,okFx){
	
	$('#modal1Btn h2').html(title);
	$('#modal1Btn p').html(text);
	
	
	$('#modal1Btn').show();
	$( document ).on('click','.okBtn',function(){
		$('#modal1Btn').hide();
		okFx();
	});

}

function showAlert(title,text,yesFn,noFn){
	$('#modal2Btn h2').html(title);
	$('#modal2Btn p').html(text);
	
	$('#modal2Btn').show();
	$( document ).on('click','.yesBtn',function(){
		$('#modal2Btn').hide();
		yesFn();
	});
	$( document ).on('click','.noBtn',function(){
		$('#modal2Btn').hide();
		noFn();
	});
}

$.fn.hasAttr = function(name) {  
	return this.attr(name) !== undefined;
};


//Star in Tap
startTap = { X : 0 , Y : 0}
$("*").tapstart(function(ev){
	startTap.X = ev.pageX || ev.originalEvent.touches[0].pageX;
	startTap.Y = ev.pageY || ev.originalEvent.touches[0].pageY;
});

function checkPress(ev){
	var endX = ev.pageX || ev.originalEvent.changedTouches[0].pageX;
	var endY = ev.pageY || ev.originalEvent.changedTouches[0].pageY;
	return Math.abs(endX - startTap.X)  < 10 && Math.abs(endY - startTap.Y) < 10	
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

