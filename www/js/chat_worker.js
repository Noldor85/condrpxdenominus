window = {
	crypto : {
		getRandomValues : function(array){
			for(var i = 0; i < array.length; i++){
				array[1] = parseInt(Math.random() * 999999999)
			}
		}
	}
}




rng_psize = 256
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

