function checkPreviusLogin(){
	 navigator.splashscreen.show();
	db.get('loginInfo').then(function(doc) {
		loginId= doc.loginId;
		tempObj = {
			loginId : doc.loginId,
			bookingVersion : 0,
			billVersion : 0,
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser"
		}
		console.log(tempObj)
				_post("/security/checkLogin",tempObj,function(data){
					loginObj = data;
					 fillUserConfig(data)
					 requestDashboardInfo()
					$("#login").fadeOut();
					requestDashboardInfo()
					navigator.splashscreen.hide();
					if (cordova.platformId == 'android') {
						StatusBar.backgroundColorByHexString("#4066b3");
					}
				},function(e){
					$("#login").fadeOut();
					navigator.splashscreen.hide();
					if (cordova.platformId == 'android') {
						StatusBar.backgroundColorByHexString("#4066b3");
					}
				})			
	}).catch(function(err){
		
		  navigator.splashscreen.hide();
	});
}



function logout(){

}

function sendPassword(){

}

function socialRegister(auth){
	showAlert("Usuario No Registrado","Desa registrar su usuario?",function(){
		cordova.plugins.barcodeScanner.scan(function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
					var tempObj = {
						qrCode : JSON.parse(result.text).qrValue,
						uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
						pushNumber : typeof device !== 'undefined' ? PN : "Browser"
					}
					
					_post("/security/register",Object.assign(tempObj,auth),function(data,status){
						$("#login").fadeOut();
						if (cordova.platformId == 'android') {
							StatusBar.backgroundColorByHexString("#4066b3");
						}
						showInfoD("Registrado","Bienvenido a su condominio")
						loginId = data.loginId;
						loginObj= data
						db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
					},function(e){
						showInfoD("Error","Ha ocurrido un error en el registro")
						console.log(e);
					})
					alert(result.text)
				}
			}
      })
	})
}


//$.get("http://54.212.218.84:2581/security/1.0",{},function(d){alert(d)})

$("#logout_btn").tapend(function(){
	showAlert("Cerrar Sessión","Desa cerrar su sessión?",function(){
		_post("/security/logout",{loginId :loginId},function(data,status){
			db.destroy().then(function(){	onDeviceReady_db()})
			$("#modal").trigger("tapend")
			clearWorkspace()
			$("#login").fadeIn();
			
		},function(e){
			showInfoD("Error","Algo salio mal, intente luego")
		})
	},function(){
		
	})
})

$(".login_input input").focus(function(){$("#login_info_txt").html("")})


$(".login--Credentials").tapend(function(){
	if(emailRegEx.test($("#login_user").val())){	
		var tempObj ={
			user : $("#login_user").val().toLowerCase(),
			password : HexWhirlpool($("#login_psw").val()),
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
			pushNumber : typeof device !== 'undefined' ? PN : "Browser"
		}
		try{
			console.log(tempObj)
		_post("/security/login",tempObj,function(data,status){
			$("#login").fadeOut();
			if (cordova.platformId == 'android') {
				StatusBar.backgroundColorByHexString("#4066b3");
			}
			
			 loginId = data.loginId;
			 loginObj= data
			  fillUserConfig(data)
			
			db.bulkDocs([
				Object.assign({"_id" : "email"},{email : tempObj.user}),
				Object.assign({"_id" : "loginInfo"},data)
			])
		
		},function(e){
			if(e.status == 401){
				$("#login_info_txt").html("Bad Credentials")
			}if(e.status == 402){
				socialRegister(tempObj)
				
			}else{
				console.log(e)
				//$("#login_info_txt").html(JSON.parse(e.responseText).error)
			}
		})
		}catch(err){
			console.log("error",err)
		}
	}else{
		$("#login_info_txt").html("Your user is not an email")
	}
});