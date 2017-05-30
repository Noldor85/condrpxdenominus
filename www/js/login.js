function checkPreviusLogin(){
	db.get('loginInfo').then(function(doc) {
		tempObj = {
			loginId : doc.loginId,
			bookingVersion : 0,
			billVersion : 0,
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
			pushNumber : typeof device !== 'undefined' ? PN : "Browser"
		}
		console.log(tempObj)
				_post("/security/1.0/checkLogin",tempObj,function(data){
					loginObg = data;
					$("#login").fadeOut();
				})			
	});
}



function logout(){

}

function sendPassword(){

}


$(".login--Credentials").tapend(function(){
		tempObj ={
		user : $("#login_user").val(),
		password : HexWhirlpool($("#login_psw").val()),
		uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
		pushNumber : typeof device !== 'undefined' ? PN : "Browser"
	}
	_post("/security/1.0/login",tempObj,function(data){
		$("#login").fadeOut();
		db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
	
	})
});