function fillUserConfig(obj){
	var properties = "";
	for(var p = 0; p <  obj.estates.length;  p++){
		properties = '<option value="'+obj.estates[p].estateId+'">'+obj.estates[p].identifier+'</option>'
	}
	$("#myProperties").append(properties);
}


$("#add_estate_btn").tapend(function(){
})



$(".authIntegration_google").tapend(function(){
	window.plugins.googleplus.login(
      {

      },
      function (result) {
		   tempObj = {
			googleKey  : HexWhirlpool(result.userId),
			userId: loginObj.userId
			}
		_post("/security/update/credentials",tempObj,function(data,status){
			showInfoD("Autenticado","Ahora esta autenticado con Google")
			
		}).fail(function(e){
			showInfoD("Error","Algo salio mal, intente luego")
			console.log(e)
		})
	  })
})


$(".authIntegration_fbk").tapend(function(){
	CordovaFacebook.login({
   permissions: ['email', 'user_likes'],
   onSuccess: function(result) {
      if(result.declined.length > 0) {
         alert("The User declined something!");
      }else{
		  console.log(result)
		 var tempObj = {
			facebookKey : HexWhirlpool(result.userID),
			userId: loginObj.userId
		}
		_post("/security/update/credentials",tempObj,function(data,status){
			showInfoD("Autenticado","Ahora esta autenticado con Facebook")
			
		}).fail(function(e){
			showInfoD("Error","Algo salio mal, intente luego")
			console.log(e)
		})
	  }
	}})
})