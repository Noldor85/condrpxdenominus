
function onDeviceReady(){
	try{
		/*var mylang = navigator.language ? navigator.language : "es"
		$.i18n.init({ lng: mylang , resGetPath: 'language/__lng__/__lng__.json',fallbackLng: 'en'},function(){
			$("[i18Trans]").each(function(){
				if( $(this).hasAttr("i18Target")){
					$(this).attr($(this).attr("i18Target"),$.t($(this).attr("i18Trans")));
				}else{
					$(this).html($.t($(this).attr("i18Trans")));
				}
			});
		});*/
		onDeviceReady_db();
		onDeviceReady_dw();
		onDeviceReady_fm();
		onDeviceReady_pn();
		onDeviceReady_au();
		document.addEventListener("backbutton", backbutton, true);
	    document.addEventListener("menubutton", menubutton, true);
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
	}catch(e){
		console.log(e)
	}
	setTimeout(function(){ $(".wConteiner div p").show();},3000);
	checkPreviusLogin();
	console.log("onDeviceReady");
	
}



if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  onDeviceReady(); //this is the browser
  console.log("we are heare")
}
 
