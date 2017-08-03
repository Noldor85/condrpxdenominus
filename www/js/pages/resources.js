var currenetResourceId;
 

var resourceSchedules ={}

function addResourceCard(resource){
	retDom = $('<div class="card" section-target="resource" section-title="'+$.t("BOOKINGS")+'"><div class="card_resource_id" style="background-image:url();"></div><div class="card_resource_info"> <div class="verticalAlign"> <div class="card_name"></div> <div class="service_description"></div> <div class="service_cost"></div></div></div></div>')					
	retDom.attr("id","rsr"+resource.id)				
	retDom.attr("section-fx-parameters",'"'+resource.id+'"')	
	retDom.find(".card_resource_id").css({"background-image" : "url("+resource.thumbnail+")"})
	retDom.find(".card_name").html(resource.name)
	retDom.find(".service_description").html(resource.description)
	retDom.find(".service_cost").html(getResourceState(resource.schedule))
	resourceSchedules[resource.id] = resource.schedule	
	if($("#rsr"+resource.id).length>0){
		$("#rsr"+resource.id).replaceWith(retDom)
	}else{
		$("#resource_list>div").append(retDom)
	}	
}


function addResourceRqstHistCard(request,state){
	var resource = $("#rsr"+request.resourceId)
	var date_ = new Date(request.date)
	var start = Int2Time(request.start)
	var end = Int2Time(request.end)
	

	retDom = $('<div class="card" ><div class="swipe_area"><div class="card_resource_id"></div><div class="card_resource_info"> <div class="verticalAlign"> <div class="card_name">Cine Torre 2</div><div class="service_description"> <div class="flex-sb"> <i class="fa fa-calendar-o"></i><date></date></div><div class="flex-sb"><i class="fa fa-clock-o"></i><div><time class="s"></time> - <time class="e"></time></div></div></div><div class="service_cost"></div></div></div></div><div class="delete_swipe"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>')					
	retDom.attr("id","rsrrsq"+request.id)	
	retDom.attr("resourceId",request.resourceId)			
	retDom.find(".card_resource_id").css({"background-image" : resource.find(".card_resource_id").css("background-image") })
	retDom.find(".card_name").html(resource.find(".card_name").html())
	retDom.find(".service_description date").html(date_.getUTCFullYear()+"-"+zeroPad(date_.getUTCMonth())+"-"+zeroPad(date_.getUTCDate()) )
	retDom.find(".service_description time.s").html(zeroPad(start.h,2) + ":" + zeroPad(start.m,2))
	retDom.find(".service_description time.e").html(zeroPad(end.h,2) + ":" + zeroPad(end.m,2))
	
	
	retDom.find(".service_cost").html('<font '+(state.guestId != request.guestId? 'color="gray" ': '' )+'>'+request.name+"</font>")
	
	if($("#rsrrsq"+request.id).length>0){
		$("#rsrrsq"+request.id).replaceWith(retDom)
	}else{
		$("#resource_request_list>div").append(retDom)
	}
	
	if(state.type == "O" || state.type == "T" || state.guestId == request.guestId){
		makePepleSwipe("#rsrrsq"+request.id+" .swipe_area");
	}
	
}



function requestResourceList(version,old){
	$(".loading").fadeIn()
	console.log(version)
	_post("/condominus/resource/read",{version: version},function(data){
		console.log("old resoure lst",old)
		if(data.version != null){
			if(old != undefined){
				console.log("old resoure lst",old)
				var newIdexes = data.resources.map(function(t){return t.id})
				old.resources = old.resources.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
				data.resources = old.resources.concat(data.resources)
			}
			db.upsert("resources",data)
			
			if(data.deleted != null){
				data.deleted.forEach(function(rsr){
					$("#rsr"+rsr).remove()
				})
			}
			data.resources.forEach(function(resource){
				addResourceCard(resource)
			})
		}
		loginInfo(function(doc){getRequstResourceList(doc.estates[estateSelected])})
	},function(err){
		window.plugins.toast.showLongCenter($.t("ERROR_SYNC_RESOURCES"))
		loginInfo(function(doc){getRequstResourceList(doc.estates[estateSelected])})
	})
}


function requestOneResource(id,version){
	$(".loading").fadeIn()
	_post("/condominus/resource/read",{version: version, resourceId: id},function(data){
		$(".loading").fadeOut()
		if(!$.isEmptyObject(data)){
			db.upsert("resource"+id,data)
			replaceResourceInfo(data)
		}
	},function(err){
				window.plugins.toast.showLongCenter($.t("ERROR_SYNC_RESOURCE_INFO"))
	})
}


function generateRuleText(rule){
	var template;
	switch (rule.template){
		case 1: 
			template = $.t("BOOKING_RULE_1")
		break;
		
		case 2: 
			template = $.t("BOOKING_RULE_2")
		break;
		
		case 3: 
			template = $.t("BOOKING_RULE_3")
		break;
		
		case 4: 
			template = $.t("BOOKING_RULE_4")
		break;
		
		case 5: 
			template = $.t("BOOKING_RULE_5")
		break;
		
		case 6:
			template = $.t("BOOKING_RULE_6")
		break;
		
		case 7:
			template = $.t("BOOKING_RULE_7")
		break;
		
		
	}
	var qty = rule.parameters && "qty" in rule.parameters ? rule.parameters.qty : ""
	var time = rule.parameters && "time" in rule.parameters ? rule.parameters.time : ""
	var timeunit = rule.parameters && "timeunit" in rule.parameters ? rule.parameters.timeunit : ""
	timeunit = timeunit in dict.timeunits ? dict.timeunits[timeunit] : ""
	var current = rule.parameters && "current" in rule.parameters ? rule.parameters.current : ""
	current = current in dict.current ? dict.current[current] : ""
	return template.replace("<qty></qty>",qty).replace("<time></time>",time).replace("<timeunit></timeunit>",timeunit).replace("<current></current>",current)
		
}

function replaceResourceInfo(resource){
	var card = $("#rsr"+currenetResourceId)
	
	$("#resourcePhoto").css({"background-image" : "url("+(resource==undefined ? "../img/service.png" :  resource.image)+")"})
	$("#resourceDescription").html(resource==undefined ? "": card.find(".service_description").html())
	if(resource == undefined){
		$("#resourceRules li").remove()
		$("table.schedule td").html($.t("CLOSED"))
	}
		
	else{
		var schedule = resourceSchedules[currenetResourceId]
		schedule.forEach(function(day){
			console.log(Boolean(day.available))
			 $("table.schedule tr:eq("+day.day+") td").html(day.available== "true" ? day.start +" - "+day.end : $.t("CLOSED"))
		})
		console.log(resource.rules)
		$("#resourceRules li").remove()
		resource.rules.forEach(function(rule){
			
			$("#resourceRules").append($('<li rule-id="'+rule.id+'">').html(generateRuleText(rule)))
		})
	}
	
}



function getResourceList(){
	db.get("resources").then(function(data){
		data.resources.forEach(function(resource){
			addResourceCard(resource)
		})
		requestResourceList(data.version,data)
	}).catch(function(err){
		requestResourceList(0)
	})
	
}


function getResourceState(schedule){
	var d = new Date()
	console.log("schedule",schedule)
	
	var thisSch = schedule.filter(function(t){return parseInt(t.day) == d.getDay()})[0]
	console.log("thisSch",thisSch)
	console.log("thisSch.available",thisSch.available)
	if(thisSch.available == "true"){
		var s = new Date()
		var e = new Date()
		var startSlited = thisSch.start.split(":")
		var endSlited = thisSch.end.split(":")
		s.setHours(startSlited[0])
		s.setMinutes(startSlited[1])
		e.setHours(endSlited[0])
		e.setMinutes(endSlited[1])
		console.log("open result",s < d && d < e)
		if(s < d && d < e){
			return '<font color="#0177D7">'+$.t("OPEN_UNTIL")+thisSch.end+'</font>'
		}
		
	}else{
		return '<font color="gray">'+$.t("CLOSED")+'</font>'
	}

}


function requestResourceRqsList(version,old,estate){
	
	loginInfo(function(doc){
		var tempObj = {
			guestId: doc.estates[estateSelected].guestId,
			version: version
		}
		console.log("tempObj",tempObj)
		_post("/condominus/bookings/readBy/resource/estate",tempObj,function(data){
			$(".loading").fadeOut()
			if(old != undefined){
				var newIdexes = data.bookings.map(function(t){return t.id})
				old.bookings = old.bookings.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
				data.bookings = old.bookings.concat(data.bookings)
			}
			db.upsert4Guest("resourcesRequests",estate.guestId,data)
			data.bookings.forEach(function(booking){
				addResourceRqstHistCard(booking,estate)
			})
			
		},function(err){
			window.plugins.toast.showLongCenter($.t("ERROR_SYNC"))
		})
	})
}

function getRequstResourceList(estate){
	db.get4Guest("resourcesRequests",estate.guestId).then(function(data){
		data.resource.forEach(function(resource){
			addResourceRqstHistCard(resource,estate)
		})
		requestResourceRqsList(data.version,data,estate)
	}).catch(function(err){
		requestResourceRqsList(0,undefined,estate)
	})
	
}


function requestTblDayBooking(c,b){
	b.forEach(function(bb){
		var start = Int2Time(bb.start)
		var end = Int2Time(bb.end)
		var dom = $('<table class="card_day_table"><tbody><tr><th class="estate"></th></tr><tr><td>'+$.t("BOOKED")+'</td></tr><tr><td class="time"></td></tr></tbody></table>')
		dom.find(".estate").html(bb.estate)
		dom.find(".time").html(zeroPad(start.h,2)+":"+zeroPad(start.m,2)+ " - "+zeroPad(end.h,2)+":"+zeroPad(end.m,2))
		c.append(dom)
	})	
	
}


function requestDayBooking(Y,M,D){
	console.log(Y+"-"+M+"-"+D)
	console.log(Y,M,D)
	var tempObj = {
		version: 0,
		bookingDate: new Date(Y+"-"+M+"-"+D).getTime(),
		resourceId: currenetResourceId
	}
	console.log(tempObj)
	$(".loading").fadeIn()
	_post("/condominus/bookings/readBy/resource/date",tempObj,function(booking){
		$(".loading").fadeOut()
		console.log(booking)
		var dom =$('<div class="card_day" card-day="'+D+'" ><div class="card_day_resource_id">'+D+'</div><div class="card_resource_info"></div></div>')
		requestTblDayBooking(dom.find(".card_resource_info"),booking.bookings)
		$(".day_container[day="+D+"]").html("")
		$(".day_container[day="+D+"]").append(dom)
	},function(){
		window.plugins.toast.showLongCenter($.t("ERROR_GETTING_BOOKINGS"))
	})
}

$(document).on("tapend","[section-name=resource] .fa-calendar-o",function(){
	$(this).removeClass("fa-calendar-o").addClass("fa-info")
	$("#infoBookins").removeClass("active")
	$("#allBookins").addClass("active")
})

$(document).on("tapend","[section-name=resource] .fa-info",function(){
	$(this).removeClass("fa-info").addClass("fa-calendar-o")
	$("#infoBookins").addClass("active")
	$("#allBookins").removeClass("active")
})

$(document).on("change","#resource_select_day select",function(){
	$(".card_day").remove()
	$(".selected_cur_day") .removeClass("selected_cur_day") 
	console.log($("#resource_select_day select").eq(0).find("option:selected").val())
	createDateCoursel(".pick_cursel_day",$("#resource_select_day select").eq(1).find("option:selected").val(),mt.indexOf($("#resource_select_day select").eq(0).find("option:selected").val()) )
})

$(document).on("tapend","#add_book",function(ev){
	if(checkPress(ev)){
		showAlert($.t("BOOK"),'<table id="tbl_for_bookin"><tr><th>'+$.t("DATE")+'</th><td><input type="date"/></td></tr><tr><th>'+$.t("START_TIME")+'</th><td><input type="time"/></td></tr><tr><th>'+$.t("END_TIME")+'</th><td><input type="time"/></td></tr></table>',function(){
			loginInfo(function(doc){
				var tempObj = {
					guestId:  doc.estates[estateSelected].guestId,
					resourceId : currenetResourceId,
					bookingDate : new Date($("#tbl_for_bookin input[type=date]").val()).getTime(),
					startTime :parseInt( $("#tbl_for_bookin input[type=time]").eq(0).val().replace(":","")),
					endTime : parseInt($("#tbl_for_bookin input[type=time]").eq(1).val().replace(":",""))
				}
				console.log("tempObj",tempObj)
				_post("/condominus/bookings/insert",tempObj,function(data){
					showInfoD($.t("BOOKED"),$.t("BOOKING_SUCCESS"))
				},function(err){
					var s;
					switch(err.status){
						case 600:
							s= $.t("ERROR_BOOKING_DATE")
						break;
						
						case 601:
							s= $.t("ERROR_INACTIVE_RESOURCE")
						break;
						
						case 602:
							s= $.t("ERROR_NOT_FOUND_RESOURCE")
						break;
						
						case 603:
							s= $.t("ERROR_BOOKING_OVERLAP")
						break;
						
						case 604:
							s= $.t("ERROR_NOT_FOUND_RESOURCE")
						break;
						
						case 605:
							s = $("li[rule-id="+err.responseJSON.rule+"]").text()
						break;
						
					    default:
							s= $.t("ERROR_GENERIC_2")
						break;
							
					}
					showInfoD($.t("ERROR_BOOKING"), s)
					console.log(JSON.stringify(err))
				})
			})
		})
	}
})

$(document).on("tapend","#resource_request_list .delete_swipe",function(ev){
	if(checkPress(ev)){
		var parent_ = $(this).parents(".card") 
		var resourceName = parent_.find(".card_name").html()
		showAlert($.t("CANCEL_BOOKING"),$.t("CANCEL_BOOKING_CONFIRMATION")+ resourceName+"?",function(){
			loginInfo(function(doc){
				var tempObj = {
					id: parent_.attr("id").substr(6),
					guestId: doc.estates[estateSelected].guestId
				}
				console.log(tempObj)
				_post("/condominus/bookings/cancel",tempObj,function(data){
					showInfoD($.t("REQUEST_CANCELED"),$.t("SERVICE_CANCEL_MESSAGE_1")+resourceName+$.t("SERVICE_CANCEL_MESSAGE_2"))
					parent_.remove()
				},function(err){
					showInfoD($.t("ERROR"),$.t("ERROR_CANCELING_SERVICE"))
				})
			})
		})
	}
})


bookin  = {
	init : function(){
		getResourceList()
		
	}
}


resource = {
	init : function(t,id){
		currenetResourceId = $(t).attr("id").substr(3);
		$("#ResourceNav .action>div").removeClass("fa-info").addClass("fa-calendar-o")
		$("#infoBookins").addClass("active")
		$("#allBookins").removeClass("active")
		console.log("currenetResourceId",currenetResourceId)
		$("#ResourceNav .title").html($(t).find(".card_name").html())
		replaceResourceInfo()
		
		db.get("resource"+currenetResourceId).then(function(doc){
			replaceResourceInfo(doc)
			requestOneResource(currenetResourceId,doc.version)
		}).catch(function(err){
			requestOneResource(currenetResourceId,0)
		})
		var d__ = new Date()
		$(".card_day").remove()
		$("#resource_select_day select").eq(0).find("option").eq(d__.getMonth()).attr("selected",true)
		$("#resource_select_day select").eq(1).html("<option>"+d__.getFullYear()+"</option><option>"+(d__.getFullYear()+1)+"</option><option>"+(d__.getFullYear()+2)+"</option>")
		createDateCoursel(".pick_cursel_day",d__.getFullYear(),d__.getMonth())
		$(".selected_cur_day") .removeClass("selected_cur_day") 
		$(".pick_cursel_day_ tr:eq(1) td").eq(12).addClass("selected_cur_day") 
		$(".pick_cursel_day tr").eq(1).find("td").eq(d__.getDate()-1).addClass("selected_cur_day") 
		
		setTimeout(function(){requestDayBooking(d__.getFullYear(),d__.getMonth(),d__.getDate())},1500)
		
	}
}
