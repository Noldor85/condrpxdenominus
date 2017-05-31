
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

function generateAESPairs(){
	var key = []
	var iv  = []
	for(var k=0; k<16;k++){
		key.push(Math.floor(Math.random() * 255 ))
	}
	for(var k=0; k<16;k++){
		iv.push(Math.floor(Math.random() * 255 ))
	}
	
	return {k: key , s: iv}
}



function RSAencript(text) {
		var before = new Date();
		var rsa = new RSAKey();
		rsa.setPublic("00d4b948bff14a76c7f9ce6660c626ff52472d7a415326bb3c2fe8028a552513ccfe6bf168455cb08e2ee78fa50f10e268930236f14a39dff966a8cd8c79b2227c2f99af3ff709b78975d549155f0d0cdfde4ee3cb9b9639452de4151b293432ff4458dd0afe843011cee1032d6254968181b2dbfd7f3acc72e4e3019572adc5a087aa7f5274cecb9a97b84b0d728dee1464af2dbc5bba5a226590bf7f455b0ee476b16a4f0fcebf975e7cd5b00b67a7d612299a035a74ba6e3577f949191d102f82cdc66092bc7c9f37274b7e6e62728953c6da411db19679e0513748c11f0ee2a3c0b95101cae72e451850ab92a44ebb47ea9d0a22e286afe68528adf466e07f", "10001");
		  var res = rsa.encrypt(text);
		  var after = new Date();
		  if(res) {
			return hex2b64(res)
		  }
	}
	

	
function _post(url,obj,cb){
	var pair = generateAESPairs()
	var textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(obj));
	var aesOfb = new aesjs.ModeOfOperation.ofb(pair.k, pair.s);
	var encryptedBytes = aesOfb.encrypt(textBytes);
	return $.post(ServerIP+url,{
			k : RSAencript(JSON.stringify(pair)),
			c : aesjs.utils.hex.fromBytes(encryptedBytes)
		},cb)
}	