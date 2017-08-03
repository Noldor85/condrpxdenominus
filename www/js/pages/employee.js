function addEmployee(obj,estate){
	var dom = requestPeopleDOM()
	var phone = obj.phone.replace(phoneRegEx,"$1")
	dom.attr("id","per"+obj.guestId)
	dom.attr("section-target", "employee")
	dom.attr("section-title", $.t("EMPLOYEES"))
	dom.attr("authorizer",obj.authorizer)
	dom.find(".call").attr("phone-number",phone)
	dom.find(".chat_lst_element_who").html(obj.name)
	dom.find(".people_lst_elemen").eq(0).html(obj.id)
	dom.find(".people_lst_elemen").eq(1).html(employeeGetAvailability(obj))
	
	if(phone == ""){
		dom.find(".call").addClass("inactive")
	}
	
	if($("#per"+obj.guestId).length>0){
		$("#per"+obj.guestId).replaceWith(dom)
	}else{
		$('#employeeList .nice-wrapper').append(dom)	
	}
	
	if(estate.type == "O" || estate.type == "T" ){
		makePeopleSwipe(dom);
	}
}



function checkMask(mask){
    var mask = zeroPad(mask.toString(2),7)
    for(var day = 0 ; day <7 ; day++){
        if(mask[day] == "1"){
        	$(".chekbox_table").find(".checkbox").eq(day).addClass("check")
        }else{
        	$(".chekbox_table").find(".checkbox").eq(day).removeClass("check")
		}

    } 
}


function replaceEmployeeInfo(data,estate,t){
	$("#employeeName").val($(t).find(".chat_lst_element_who").html())
	$("#employeeId").val($(t).find(".people_lst_elemen").eq(0).html())
	$("#employeePhone").val($(t).find(".call").attr("phone-number"))
	if(data == undefined){
		$("#employeeNotifyIn").prop('checked', false);
		$("#employeeNotifyOut").prop('checked', false);
		$("#employeeDateStart").val("")
		$("#employeeDateEnd").val("")
		$("#employeeStartTime").val("")
		$("#employeeEndTime").val("")
		checkMask(0)
		$("[section-name=employee] .save_btn").show()
	}else{
		if (data.guest) {
			var stime = Int2Time(data.guest.startTime)
			var etime = Int2Time(data.guest.endTime)
			console.log(etime)
			$("#employeeNotifyIn").prop('checked', data.guest.notification);
			$("#employeeNotifyOut").prop('checked', data.guest.notificationOut);
			$("#employeeDateStart").val(normalDateOnly(data.guest.startDate))
			$("#employeeDateEnd").val(normalDateOnly(data.guest.endDate))
			$("#employeeStartTime").val(zeroPad(stime.h,2)+":"+zeroPad(stime.m,2))
			$("#employeeEndTime").val(zeroPad(etime.h,2)+":"+zeroPad(etime.m,2))
			
			checkMask(data.guest.mask)
			
			if("entryCode" in data.guest && data.guest.entryCode != null){
				createPDF417("employeeCodeCanvas",data.guest.entryCode)
				$(".circle.bottom").show()
			}else{
				$(".circle.bottom").hide()
			}
		}
		$("[section-name=employee] .save_btn").css({"display" : (estate.type == "O" || estate.type == "T"  )? "block" : "none"})
	}
	
	
	
	
}


function getMaskWeek(){
	var retStr = ""
		$(".chekbox_table .checkbox").each(function(){ retStr += $(this).hasClass("check")?"1":"0"})
	return parseInt(retStr)
}


function printLogs(logs){
	console.log("los logs: ", logs)
	$("#entryLog_table tbody").empty()
	for(month in logs.logs){
		console.log("sdssdsssnnn")
		 logs.logs[month].forEach(function(log){
		 	console.log("SSSSSSSSSSSSSSsss")
			 var monthStr = month.split("-")
			 monthStr[1] = zeroPad(monthStr[1],2)
			 monthStr = monthStr.join("-")
			 
			 var dom =$('<tr month="'+monthStr+'"><td>'+normalDateLocal(log.entryDate)+'</td><td>'+(log.departureDate ==null ? "" : normalDateLocal(log.departureDate))+'</td></tr>')
			 console.log(dom)
			$("#entryLog_table tbody").append(dom)
		})
		
	}
	var date = new Date()
	var datS = date.getFullYear()+"-"+zeroPad(date.getMonth()+1,2)
	filertLogs(datS)
	$("#selectMonth").val(datS)
	
}

function getNewLogs(old, newLogs) {
	var oldO = {}
	for (var i = 0; i < old.length; i++) {
		var val = old[i]
		oldO[val.entryLogId] = val
	}

	for (var i = 0; i < newLogs.length; i++) {
		var val = newLogs[i]
		oldO[val.entryLogId] = val
	}

	var mergeLogs = []
	for (key in oldO) {
		mergeLogs.push(oldO[key])
	}
	return mergeLogs
}

function insertLogs(logs,old){
	if(old != undefined && old != null && typeof old == "object" && "logs" in old){
		for(month in logs.logs){
			if(month in old.logs){
				// Object.assign(old.logs[month],logs.logs[month])
				old.logs[month] = getNewLogs(old.logs[month],logs.logs[month])
			}else{
				old.logs[month] = logs.logs[month]
			}
			
		}
		old.version = (logs.version || old.version)
	}else{old = logs}
	
	db.upsert("log_"+currentPersonId,old)
	printLogs(old)
}


function getInOutEmployeeLog(){
	console.log("sddddddddddd")
	loginInfo(function(doc){
		var tempObj =  {
			"viewer" : doc.estates[estateSelected].guestId,
			"guestId" : currentPersonId,
			
		}
		console.log()
		
		db.get("log_"+currentPersonId).then(function(old){
			console.log(old)
			tempObj.version = old.version
			_post("/condominus/guest/read/entryLog",tempObj,function(data){insertLogs(data,old)})
		}).catch(function(e){
			tempObj.version = 0
			_post("/condominus/guest/read/entryLog",tempObj,insertLogs)
		})
			
	})
	
	
	
}

function filertLogs(month){
	$("#entryLog_table tbody tr:not([month="+month+"])").hide()
	$("#entryLog_table tbody tr[month="+month+"]").show()
}

$(document).on("change","#selectMonth",function(){
	filertLogs($(this).val())
})



$(document).on("tapend","#employeeNav .fa-ellipsis-v",function(ev){
	$(".circle.left .label").html($.t("LOG_MARK"))
	$(".circle.left").removeClass("fa-car").addClass("fa-bookmark")
	$(".internalMenu").fadeIn();
	$(".circle.left").animate({"margin-left": "-150px", "margin-top": "-40px"},function(){$(".circle.left .label").fadeIn()})
	$(".circle.top").animate({"margin-left": "-50px", "margin-top": "-150px"},function(){$(".circle.top .label").fadeIn()})
	$(".circle.right").animate({"margin-left": "50px", "margin-top": "-40px"},function(){$(".circle.right .label").fadeIn()})
	$(".circle.bottom").animate({"margin-left": "-50px", "margin-top": "60px"},function(){$(".circle.bottom .label").fadeIn()})
	
	internalMenuTarget = "employee"
})

$(document).on("tapend","#employeeNav .fa-bookmark",function(ev){
	$(this).removeClass("bookmark").addClass("fa-address-card-o")
	$("#employeeInfo").removeClass("active");
	$("#employeeBookmark").addClass("active")
	$("#entryLog_table tbody").html("")
	getInOutEmployeeLog()
	
})

$(document).on("tapend","#employeeNav .fa-address-card-o",function(ev){
	$(this).removeClass("fa-address-card-o").addClass("bookmark")
	$("#employeeBookmark").removeClass("active");
	$("#employeeInfo").addClass("active")
	
})

employee = {
	init : function(t){
		currentPersonIdCode = undefined
		currentPersonId = $(t).attr("id").substr(3);
		$("#employeeNav .title").html($(t).find(".chat_lst_element_who").length > 0 ? $(t).find(".chat_lst_element_who").html() : $.t("NEW_EMPLOYEE"))
		$(".circle").removeClass("active")
		$(".circle.top").addClass("active")
		$("#employeeBookmark").removeClass("active");
		$("#employeeCode").removeClass("active");
		$("#employeeInfo").addClass("active")
		replaceEmployeeInfo()
		loginInfo(function(doc){getOnePerson(currentPersonId,doc.estates[estateSelected],replaceEmployeeInfo,t)})
	},
	
	getSaveObj :function() {
		loginInfo(function(doc){
			var estate = doc.estates[estateSelected]
			 var tempObj =	{
				"authorizer" : estate.guestId,
				"estateId": estate.estateId,
				"name" : $("#employeeName").val(),
				"personalId" :  $("#employeeId").val(),
				"type" : "E",
				"phone" :$("#employeePhone").val(),
				"notification" : $("#employeeNotifyIn").is(":checked") ,
				"notificationOut" : $("#employeeNotifyOut").is(":checked"),
				"startDate": new Date($("#employeeDateStart").val()).getTime(),
				"endDate": new Date($("#employeeDateEnd").val()).getTime(),
				"startTime": parseInt($("#employeeStartTime").val().replace(":","")),
				"endTime": parseInt($("#employeeEndTime").val().replace(":","")),
				"maskDaysWeek" : getMaskWeek(),
				"temporalCode" : false,
				"permanent": false
			}
			console.log(tempObj)
			
			if(currentPersonId != -1){
				tempObj.guestId = currentPersonId
			}else if(currentPersonIdCode != undefined){
				tempObj.entryCode = currentPersonIdCode
			}else{
				tempObj.temporalCode = true
			}
			
			_post("/condominus/guest/manage/entry",tempObj,function(data){
				if(currentPersonId != -1){
					showInfoD($.t("UPDATED_EMPLOYEE_HEADER"),$.t("UPDATED_EMPLOYEE_DETAIL"))
				
				}else{
					currentPersonId = data.guestId
					showInfoD($.t("CREATED_EMPLOYEE_HEADER"),$.t("CREATED_EMPLOYEE_DETAIL"))
				}
				$("#employeeNav .title").html($("#employeeName").val())
			}
			,creationPeopleErrorCode)
		})
	},
	
	validate : function(){
		return []
	}
}
