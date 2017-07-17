
function addHabitant(obj,estate){
	var dom = requestPeopleDOM()
	var phone = ("phone" in obj )? obj.phone.replace(phoneRegEx,"$1") : "";
	dom.attr("id","per"+obj.guestId)
	dom.attr("section-target", "habitant")
	dom.attr("section-title", "Habitantes")
	dom.find(".chat_lst_element_who").html(obj.name)
	dom.find(".call").attr("phone-number",phone)
	
	dom.find(".people_lst_elemen").eq(0).html(obj.id)
	if(phone == ""){
		dom.find(".call").addClass("inactive")
	}
	if(obj.type == "O"){
		dom.find(".fa-user").removeClass("fa-user").addClass("fa-user-secret")
	}
	if(obj.userId){
		var dom2 = dom.clone()
		dom2.attr("id","usr"+obj.guestId)
		
		if($("#usr"+obj.guestId).length>0){
			$("#usr"+obj.guestId).replaceWith(dom2)
		}else{
			$('#userList .nice-wrapper').append(dom2)	
		}
		
		
	}else{
		dom.find(".fa-user").removeClass("fa-user").addClass("fa-bed")
	}
	
	
	if($("#per"+obj.guestId).length>0){
		$("#per"+obj.guestId).replaceWith(dom)
	}else{
		$('#habitantList .nice-wrapper').append(dom)	
	}
	
	
	if((estate.type == "O" || estate.type == "T")&&(estate.guestId != obj.guestId)){
		makePeopleSwipe(dom);
	}
	
}

function replaceHabitantInfo(data,estate,t){
	console.log($(t))
	$("#habitantName").val($(t).find(".chat_lst_element_who").html())
	$("#habitantId").val($(t).find(".people_lst_elemen").eq(0).html())
	$("#habitantPhone").val($(t).find(".call").attr("phone-number"))
	if(data == undefined){
		
		$("#habitantCar #cars_table tbody").html("")
		$("#qrcode").html("")
		$("#qrcode").hide()
		$(".share_btn").hide()
		$("[section-name=habitant] .save_btn").show()
		
	}else{
		console.log("repace",data)
		if(data.guest.qrCode && (estate.type == "O" || estate.type == "T")){
			new QRCode(document.getElementById("qrcode"),{text: data.guest.qrCode, colorDark : "#0177D7",correctLevel : QRCode.CorrectLevel.M ,width: 150, height:150});
			$("#qrcode").show()
			$(".share_btn").show()
		}
	
		data.plates.forEach(function(plate){
			var domPlate = requestPlateDOM()
			domPlate.find("input").val(plate.plate)
			domPlate.find("select option[value="+plate.type+"]").attr("selected", "selected");
			$("#habitantCar #cars_table tbody").append(domPlate)
		})
		
		
		$("[section-name=habitant] .save_btn").css({"display" : (estate.type == "O" || estate.type == "T" )? "block" : "none"})
		
	}
	
		
	
}



$(document).on("tapend","#habitantNav .fa-car",function(ev){
	$(this).removeClass("fa-car").addClass("fa-address-card-o")
	$("#habitantInfo").removeClass("active");
	$("#habitantCar").addClass("active")
})

$(document).on("tapend","#habitantNav .fa-address-card-o",function(ev){
	$(this).removeClass("fa-address-card-o").addClass("fa-car")
	$("#habitantCar").removeClass("active");
	$("#habitantInfo").addClass("active")
})


$(document).on("tapend",".share_btn",function(ev){
	if(checkPress(ev)){
		window.plugins.socialsharing.share('Con este codigo puede registrar su usuario asociado a la propiedad', null, $("#qrcode").find("img").attr("src"), 'http://baja.nuestro.app/')
	}
})





habitant  = {
	init : function(t){
		currentPersonId = $(t).attr("id").substr(3);
		$("#habitantNav .title").html(($(t).find(".chat_lst_element_who").length >0) ? $(t).find(".chat_lst_element_who").html() : "Nuevo Habitante")
		$("[section-name=habitant]").find(".fa-address-card-o").removeClass("fa-address-card-o").addClass("fa-car")
		$("#habitantCar").removeClass("active");
		$("#habitantInfo").addClass("active")
		replaceHabitantInfo()
		loginInfo(function(doc){getOnePerson(currentPersonId,doc.estates[estateSelected],replaceHabitantInfo,$(t))})
	},
	
	getSaveObj :function() {
		loginInfo(function(doc){
			var estate = doc.estates[estateSelected]
			 var tempObj =	{
				"authorizer" : estate.guestId,
				"estateId": estate.estateId,
				"name" : $("#habitantName").val(),
				"personalId" :  $("#habitantId").val(),
				"type" : "G",
				"phone" :$("#habitantPhone").val(),
				"vehicles" : getPlatesObj("#habitantCar")
			}
			if(currentPersonId != -1){
				tempObj.guestId = currentPersonId
			}
			_post("/condominus/guest/manage/habitant",tempObj,function(data){
				if(currentPersonId != -1){
					showInfoD("Habitante Actualizado","Se cambiaron los datos del habitante con éxito")
				}else{
					showInfoD("Habitante Creado","Se ha creado el habitante con éxito. Comparta el código QR para que este cree un usuario")
					currentPersonId = data.guestId
					new QRCode(document.getElementById("qrcode"),{text: data.qrValue, colorDark : "#0177D7",correctLevel : QRCode.CorrectLevel.M , width: 150, height:150});
					$("#qrcode").show()
					$(".share_btn").show()
				}
				$("#habitantNav .title").html($("#habitantName").val())
			}
			,creationPeopleErrorCode)
		})
	},
	
	validate : function(){
		return []
	}
}

