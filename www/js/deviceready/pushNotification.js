var pushNotification;


function onDeviceReady_pn(){
	try{		
		push = PushNotification.init({
			android: {
				senderID: "125107308805"
			},
			browser: {
				pushServiceURL: 'http://push.api.phonegap.com/v1/push'
			},
			ios: {
				alert: "true",
				badge: true,
				sound: 'false'
			},
			windows: {}
		
		});
	}catch(e){
		console.log(e)
	}
	
	push.on('registration', function(data) {
		console.log(data.registrationId);
		alert(e)
		PN = data.registrationId;
	});
	
	push.on('notification', function(data) {
		console.log(data.message);
		console.log(data.title);
		console.log(data.count);
		console.log(data.sound);
		console.log(data.image);
		console.log(data.additionalData);
	});
	
	push.on('error', function(e) {
		console.log(e.message);
	});
	
	console.log(device.platform);
}
