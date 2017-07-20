$("#header_user_btn").tapend(function(){
	
	db.get('fbkToken').then(function(doc) {
		$("#profilePicture").prop("src","https://graph.facebook.com/me/picture?access_token="+doc.token)
		$.get("https://graph.facebook.com/me?access_token="+doc.token,function(data){
			$("#personalProfile span").html(data.name)
			
		})

		
	}).catch(function(e){
		db.get('googleObj').then(function(doc) {
			$("#personalProfile span").html(doc.displayName)
			$("#profilePicture").prop("src",doc.imageUrl)
		}).catch(function(e){
			db.get('email').then(function(email){
				$("#personalProfile span").html(email.email)
				var data = new Identicon(HexWhirlpool(email.email), 420).toString();
				$("#profilePicture").prop("src",'data:image/png;base64,' + data)
			})
		})
	})
	
	
	
	loginInfo(function(doc){
		var estatesStr =""
		for(var estId =0; estId < doc.estates.length ; estId++){
			var estate = doc.estates[estId];
			estatesStr += '<option value="'+estId+'" '+(estId == estateSelected ? "selected" : "")+'>'+estate.identifier+'</option>'
		}
		doc.estates.forEach(function(estate){
			
		})
		$("#myProperties").html(estatesStr).change(function(){
				estateSelected = $(this).find("option:selected").attr("value")
				$("#condo_logo").trigger("tapend")
				showInfoD($.t("SWITCH_ESTATE_HEADER"),$.t("SWITCH_ESTATE_DETAIL")+  $(this).find("option:selected").html)
				
		})
	})
	
	
	
	$("#modal").fadeIn();
	$("#user_config").fadeIn();
});


function fillUserConfig(obj){
	requestDashboardInfo()
}


$("#add_estate_btn").tapend(function(){
	cordova.plugins.barcodeScanner.scan(function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
					loginInfo(function(doc){
						var tempObj ={
							"userId": doc.userId,
							"qrCode" : JSON.parse(result.text).qrValue
						}
						_post("/condominus/guest/addEstate",tempObj,function(data){
							doc.estates.push(data)
							db.upsert("loginInfo",doc)
							showInfoD($.t("SUCCESS"),$.t("ESTATE_ADDED"))
						},function(err){
							showInfoD($.t("ERROR"),$.t("SOMETHING_WENT_WRONG"))
						})

					})
				}
			}
	})
})


$(document).on("change","#myProperties",function(){
		$("#condo_logo").trigger("tapend")
		$("#modal").trigger("tapend")
		estateSelected = $(this).find("option:selected").val()
		var estateName = $("#myProperties").find("option:selected").html()
		console.log(estateName)
		clearWorkspace()
		showInfoD($.t("SWITCH_ESTATE_HEADER"),$.t("YOU_ARE_IN_ESTATE")+estateName,function(){})
})


$(document).on("tapend",".close_modal_btn",function(){
	$("#modal").trigger("tapend")
	
})



$(".authIntegration_google").tapend(function(){
	window.plugins.googleplus.login(
      {

      },
      function (result) {
		  loginInfo(function(loginObj){
			  var tempObj = {
				googleKey  : HexWhirlpool(result.userId),
				userId: loginObj.userId
				}
			_post("/security/update/credentials",tempObj,function(data,status){
				showInfoD($.t("AUTHENTICATED"),$.t("GOOGLE_AUTHENTICATION"))
				
			},function(e){
				showInfoD($.t("ERROR"),$.t("SOMETHING_WENT_WRONG_RETRY"))
				console.log(e)
			})
		  })
	  })
})

$(".authIntegration_key").tapend(function(ev){
	if(checkPress(ev)){
		showAlert($.t("UPDATED_CREDENTIALS"),'<table><tr><th>'+$.t("EMAIL")+'</th><td><input type="email" class="psw_input_usr"></td></tr><tr><th>'+$.t("PASSWORD")+'</th><td><input type="text" class="psw_input_usr"></td></tr></table>',function(){
			loginInfo(function(loginObj){
				var tempObj = {
					password : HexWhirlpool($(".psw_input_usr").eq(1).val()),
					user : $(".psw_input_usr").eq(0).val(),
					userId: loginObj.userId
				}
				console.log(tempObj)
				_post("/security/update/credentials",tempObj,function(data,status){
					showInfoD($.t("SUCCESS"),$.t("UPDATED_CREDENTIALS_SUCCESS"))
					$("#personalProfile span").html(tempObj.user)
				},function(e){
					showInfoD($.t("ERROR"),$.t("SOMETHING_WENT_WRONG_RETRY"))
					console.log(e)
				})
			})
		})
	}
})

$(".authIntegration_fbk").tapend(function(){
	CordovaFacebook.login({
   permissions: ['email', 'user_likes'],
   onSuccess: function(result) {
      if(result.declined.length > 0) {
         showInfoD($.t("ERROR"),$.t("USER_DECLINED_SOMETHING"));
      }else{
		  console.log(result)
		  loginInfo(function(loginObj){
			 var tempObj = {
				facebookKey : HexWhirlpool(result.userID),
				userId: loginObj.userId
			}
			_post("/security/update/credentials",tempObj,function(data,status){
				db.upsert('fbkToken', {token: result.accessToken}).then(function(doc){console.log(doc)})
				showInfoD($.t("AUTHENTICATED"),$.t("FACEBOOK_AUTHENTICATION"))
				
			},function(e){
				showInfoD($.t("ERROR"),$.t("SOMETHING_WENT_WRONG_RETRY"))
				console.log(e)
			})
		})
	  }
	}})
})