$(".loginBtn--google").tapend(function(){
  window.plugins.googleplus.login(
      {

      },
      function (result) {
		   tempObj = {
			"googleKey"  : HexWhirlpool(result.userId),
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
			pushNumber : typeof device !== 'undefined' ? PN : "Browser" 
		}
       _post("/security/1.0/login",tempObj,function(data,status){
		$("#login").fadeOut();
		console.log(data)
		loginId = data.loginId;
			db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
		}).fail(function(e){
			socialRegister({"googleKey"  : HexWhirlpool(result.userId)})
		})
        consle.log(result); // do something useful instead of alerting 
      },
      function (msg) {
        alert('error: ' + msg);
      }
  );
})