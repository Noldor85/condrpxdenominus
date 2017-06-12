window = {
	crypto : {
		getRandomValues : function(array){
			for(var i = 0; i < array.length; i++){
				array[1] = parseInt(Math.random() * 999999999)
			}
		}
	}
}





importScripts('globals.js');
importScripts('../lib/rsa/rsa.js');
importScripts('../lib/rsa/BigInt.js');
importScripts('../lib/rsa/Barrett.js');
importScripts('../lib/rsa/jsbn.js');
importScripts('../lib/rsa/rng.js');
importScripts('../lib/rsa/jsbn2.js');
importScripts('../lib/rsa/prng4.js');
importScripts('../lib/rsa/base64.js');
queueSendPendings = [];
var i = 0;



xhrRequest = function(message){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", '../../chatDriver.php', false);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	console.log("sending msg> ", message)
	xhr.send("msg="+message);
	console.log("status> " ,xhr.status)
	if(xhr.status == 200){
		postMessage(xhr.responseText)
		return false;
	}else{
		return true;
	}
}
trySend = function(){
	queueSendPendings = queueSendPendings.filter(function(this_){
		return xhrRequest(this_);
		
	})
	if(queueSendPendings.length> 0){
		setTimeout(trySend,1000)
	}
}

onmessage = function(e) {
	queueSendPendings.push(e.data)
	trySend();
}

