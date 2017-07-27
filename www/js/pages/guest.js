
function addGuest(obj,estate){
	var dom = requestPeopleDOM()
	var phone = obj.phone.replace(phoneRegEx,"$1")
	dom.attr("id","per"+obj.guestId)
	dom.attr("section-target", "guest")
	dom.attr("section-title", $.t("GUESTS"))
	dom.find(".call").attr("phone-number",phone)
	dom.find(".chat_lst_element_who").html(obj.name)
	dom.find(".people_lst_elemen").eq(0).html(obj.id)
	dom.find(".people_lst_elemen").eq(1).html(guestGetAvailability(obj))
	
	if(phone == ""){
		dom.find(".call").addClass("inactive")
	}
	
	if($("#per"+obj.guestId).length>0){
		$("#per"+obj.guestId).replaceWith(dom)
	}else{
		$('#guestList .nice-wrapper').append(dom)	
	}
	console.log("estate.type",estate.type)
	if(estate.type == "O" || estate.type == "T" || obj.authorizer ==  estate.guestId){
		makePeopleSwipe(dom);
	}
}

function replaceGuestInfo(data,estate,t){
	$("#guestName").val($(t).find(".chat_lst_element_who").html())
	$("#guestId").val($(t).find(".people_lst_elemen").eq(0).html())
	$("#guestPhone").val($(t).find(".call").attr("phone-number"))
	if(data == undefined){
		$("#guestNotifyIn").prop('checked', false);
		$("#guestPermanent").prop('checked', false);
		$("#guestDateStart").val("")
		$("#guestStartTime").val("")
		$("#guestCar #cars_table tbody").html("")
		$("[section-name=guest] .save_btn").show()
		
	}else{
		var stime = Int2Time(data.guest.startTime)
		$("#guestNotifyIn").prop('checked', data.guest.notification);
		$("#guestPermanent").prop('checked', data.guest.permanent);
		$("#guestDateStart").val(normalDateOnly(data.guest.startDate))
		$("#guestStartTime").val(zeroPad(stime.h,2)+":"+zeroPad(stime.m,2))
		if(!$("#guestPermanent").is(":checked")){
			$("#guestDateStart").parents("tr").show()
			$("#guestStartTime").parents("tr").show()
		}else{
			 $("#guestDateStart").parents("tr").hide()
			 $("#guestStartTime").parents("tr").hide()
		}
		data.plates.forEach(function(plate){
			var domPlate = requestPlateDOM()
			domPlate.find("input").val(plate.plate)
			domPlate.find("select option[value="+plate.type+"]").attr("selected", "selected");
			$("#guestCar #cars_table tbody").append(domPlate)
		})
		
		
		
		
		$("[section-name=guest] .save_btn").css({"display" : (estate.type == "O" || estate.type == "T" || $(t).attr("authorizer") ==  estate.guestId || currentPersonId == -1 )? "block" : "none"})
	
	}
	
}

$("#guestPermanent").change(function(){
	if(!$(this).is(":checked")){
		 $("#guestDateStart").parents("tr").show()
		 $("#guestStartTime").parents("tr").show()
	}else{
		 $("#guestDateStart").parents("tr").hide()
		 $("#guestStartTime").parents("tr").hide()
	}
})



$(document).on("tapend","#guestNav .fa-car",function(ev){
	$(this).removeClass("fa-car").addClass("fa-address-card-o")
	$("#guestInfo").removeClass("active");
	$("#guestCar").addClass("active")
})

$(document).on("tapend","#guestNav .fa-address-card-o",function(ev){
	$(this).removeClass("fa-address-card-o").addClass("fa-car")
	$("#guestCar").removeClass("active");
	$("#guestInfo").addClass("active")
})







guest = {
	init : function(t){
		currentPersonId = $(t).attr("id").substr(3);
		$("#guestNav .title").html($(t).find(".chat_lst_element_who").length ? $(t).find(".chat_lst_element_who").html() : $.t("NEW_GUEST"))
		$("[section-name=guest]").find(".fa-address-card-o").removeClass("fa-address-card-o").addClass("fa-car")
		$("#guestCar").removeClass("active");
		$("#guestInfo").addClass("active")
		replaceGuestInfo()
		loginInfo(function(doc){getOnePerson(currentPersonId,doc.estates[estateSelected],replaceGuestInfo,t)})
		
	},
	
	getSaveObj :function() {
	loginInfo(function(doc){
		var estate = doc.estates[estateSelected]
		 var tempObj =	{
			"authorizer" : estate.guestId,
			"estateId": estate.estateId,
			"name" : $("#guestName").val(),
			"personalId" :  $("#guestId").val(),
			"type" : "V",
			"phone" :$("#guestPhone").val(),
			"vehicles" : getPlatesObj("#guestCar"),
			"notification" : $("#guestNotifyIn").is(":checked") ,
			"permanent" : $("#guestPermanent").is(":checked"),
			"startDate": new Date($("#guestDateStart").val()).getTime(),
			"startTime": parseInt($("#guestStartTime").val().replace(":","")),
			"notificationOut" : false	
		}
		
		
		if(currentPersonId != -1){
				tempObj.guestId = currentPersonId
		}
		
		console.log("tempObj",tempObj)
		
		_post("/condominus/guest/manage/entry",tempObj,function(data){
			if(currentPersonId != -1){
				showInfoD($.t("UPDATED_GUEST_HEADER"),$.t("UPDATED_GUEST_DETAIL"))
				
			}else{
				currentPersonId = data.guestId
				showInfoD($.t("CREATED_GUEST_HEADER"),$.t("CREATED_GUEST_DETAIL"))
			}
			$("#guestNav .title").html($("#guestName").val())
		}
		,creationPeopleErrorCode)
	})
},
	
	validate : function(){
		return []
	}
}
