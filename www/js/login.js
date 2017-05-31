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


//$.get("http://54.212.218.84:2581/security/1.0",{},function(d){alert(d)})

$("#logout_btn").tapend(function(){
	db.destroy()
})

$(".login_input input").focus(function(){$("#login_info_txt").html("")})


$(".login--Credentials").tapend(function(){
		tempObj ={
		user : $("#login_user").val(),
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
		}else{
			$("#login_info_txt").html(JSON.parse(e.responseText).error)
		}
	})
	}catch(e){
		alert("error")
		alert(JSON.stringify(e))
	}
});