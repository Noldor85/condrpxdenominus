function checkPreviusLogin(){
	 navigator.splashscreen.show();
	db.get('loginInfo').then(function(doc) {
		tempObj = {
			loginId : doc.loginId,
			bookingVersion : 0,
			billVersion : 0,
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser"
		}
		console.log(tempObj)
				_post("/security/1.0/checkLogin",tempObj,function(data){
					loginObg = data;
					$("#login").fadeOut();
					navigator.splashscreen.hide();
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
					
					_post("/security/1.0/register",Object.assign(tempObj,auth),function(data,status){
						$("#login").fadeOut();
						showInfoD("Registrado","Bienvenido a su condominio")
						db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
					}).fail(function(e){
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
	db.destroy()
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
		_post("/security/1.0/login",tempObj,function(data,status){
			$("#login").fadeOut();
			
			db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
		
		}).fail(function(e){
			if(e.status == 401){
				$("#login_info_txt").html("Bad Credentials")
			}if(e.status == 401){
				socialRegister(tempObj)
				
			}else{
				$("#login_info_txt").html(JSON.parse(e.responseText).error)
			}
		})
		}catch(e){
			alert("error")
			alert(JSON.stringify(e))
		}
	}else{
		$("#login_info_txt").html("Your user is not an email")
	}
});