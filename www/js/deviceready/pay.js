
function onDeviceReady_py(){
	BraintreePlugin.initialize(btToken,
		function () {
			console.log("init payment");
		},
		function (error) { console.error(error); }
	);
}


