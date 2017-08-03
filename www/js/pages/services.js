var currentServiceId;

function addServiceCard(service){
	retDom = $('<div class="card" section-target="servicePage" section-title="'+$.t("SERVICE")+'"><div class="card_resource_id" style="background-image:url();"></div><div class="card_resource_info"> <div class="verticalAlign"> <div class="card_name"></div> <div class="service_description"></div> <div class="service_cost"></div></div></div></div>')					
	retDom.attr("id","srv"+service.id)				
	retDom.attr("section-fx-parameters",'"'+service.id+'"')		
	retDom.find(".card_resource_id").css({"background-image" : "url("+service.thumbnail+")"})
	retDom.find(".card_name").html(service.name)
	retDom.find(".service_description").html(service.desc)
	retDom.find(".service_cost").html(service.cost.thousand()+ " "+ service.currency)
	
	if($("#srv"+service.id).length>0){
		$("#srv"+service.id).replaceWith(retDom)
	}else{
		$("#service_list>div").append(retDom)
	}	
}


function addServiceRqstHistCard(request,state){
	var service = $("#srv"+request.serviceId)
	console.log(service)
	retDom = $('<div class="card"><div class="swipe_area"><div class="card_resource_id" style="background-image:url();"></div><div class="card_resource_info"> <div class="verticalAlign"> <div class="card_name"></div> <div class="service_description"></div> <div class="service_cost"></div></div></div></div><div class="delete_swipe"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div>')					
	retDom.attr("id","srvrsq"+request.id)	
	retDom.attr("serviceId",request.serviceId)			
	retDom.find(".card_resource_id").css({"background-image" : service.find(".card_resource_id").css("background-image") })
	retDom.find(".card_name").html(service.find(".card_name").html())
	retDom.find(".service_description").html(request.description)
	retDom.find(".service_cost").html(normalDateLocal(request.requestDate))
	
	if($("#srvrsq"+request.id).length>0){
		$("#srvrsq"+request.id).replaceWith(retDom)
	}else{
		$("#service_request_list>div").append(retDom)
	}
	
	if(state.type == "O" || state.type == "T" || state.guestId == request.guestId){
		makePepleSwipe("#srvrsq"+request.id+" .swipe_area");
	}
	
}

function requestServiceList(version,old){
	_post("/condominus/service/read",{version: version},function(data){
		if(data.version != null){
			if(old != undefined){
				var newIdexes = data.services.map(function(t){return t.id})
				old.services = old.services.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
				data.services = old.services.concat(data.services)
			}
			db.upsert("services",data)
			data.services.forEach(function(service){
				addServiceCard(service)
			})
		}
		loginInfo(function(doc){getRequstServiceList(doc.estates[estateSelected])})
		
		
	},function(err){
		window.plugins.toast.showLongCenter($.t("ERROR_SYNC"))
		loginInfo(function(doc){getRequstServiceList(doc.estates[estateSelected])})
	})
}


function requestServiceRqsList(version,old,estate){
	
	
		var tempObj = {
			guestId: estate.guestId,
			version: version
		}
		_post("/condominus/service/byGuest/read",tempObj,function(data){
			$(".loading").fadeOut()
			if(data.version != null){
				if(old != undefined){
					var newIdexes = data.services.map(function(t){return t.id})
					old.services = old.services.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
					data.services = old.services.concat(data.services)
				}
				db.upsert4Guest("servicesRequests",estate.guestId,data)
				data.services.forEach(function(service){
					addServiceRqstHistCard(service,estate)
				})
			}
			
		},function(err){
			window.plugins.toast.showLongCenter($.t("ERROR_SYNC_SERVICES"))
		})

}


function getServiceList(){
	db.get("services").then(function(data){
		data.services.forEach(function(service){
			addServiceCard(service)
		})
		requestServiceList(data.version,data)
	}).catch(function(err){
		requestServiceList(0)
	})
	
}

function getRequstServiceList(estate){
	db.get4Guest("servicesRequests",estate.guestId).then(function(data){
		data.services.forEach(function(service){
			addServiceRqstHistCard(service,estate)
		})
		requestServiceRqsList(data.version,data,estate)
	}).catch(function(err){
		requestServiceRqsList(0,undefined,estate)
	})
}


function replaceServiceInfo(service){
	//console.log(service)
	$("#service_photo").css({"background-image" : "url("+(service==undefined ? "../img/service.png" :  service.photo)+")"})
	$("#servicePage_cost").html(service==undefined ? "": service.cost.thousand()+ " "+ service.currency)
	$("#serviceDescription").html(service==undefined ? "": service.desc)
	$("#service_contactEmail").html(service==undefined ? "": service.email)
	$("#service_contactName").html(service==undefined ? "": service.contact)
	if(service == undefined){$(".service_contactPhone").remove()}
	else{
		for(var phone in service.phones){
			var number = service.phones[phone]
			$('<tr><td>'+phone+'</td><td><a href="tel:'+number+'">'+number+'</a></td></tr>');
								
		}
	}
	
}

function requestOneService(id,version){
	$(".loading").fadeIn()
	_post("/condominus/service/read",{version: version, serviceId: id},function(data){
		$(".loading").fadeOut()
		if(!$.isEmptyObject(data)){
			db.upsert("service"+id,data)
			replaceServiceInfo(data)
		}
	},function(err){
				window.plugins.toast.showLongCenter($.t("ERROR_SYNC"))
	})
}


$(document).on("tapend","#requestSrvBtn",function(ev){
	if(checkPress(ev)){
		var serviceName = $("#ServiceNav .title").html()
		showAlert($.t("SERVICE_REQUEST"),"<span>"+$.t("COMMENTARY")+"<span><textarea id='service_comment' class='prompt'></textarea>",function(){
			loginInfo(function(doc){
				var tempObj = {
					serviceId: currentServiceId,
					guestId: doc.estates[estateSelected].guestId,
					description: $("#service_comment").val()
				}
				_post("/condominus/service/byGuest/request",tempObj,function(data){
					showInfoD($.t("REQUEST_COMPLETED"),$.t("SERVICE_MESSAGE_1")+serviceName+$.t("SERVICE_REQUEST_MESSAGE_1"))
				},function(err){
					showInfoD($.t("ERROR"),$.t("ERROR_REQUEST_SERVICE"))
				})
			})
		})
	}
})

$(document).on("tapend","#service_request_list .delete_swipe",function(ev){
	if(checkPress(ev)){
		var parent_ = $(this).parents(".card") 
		var serviceName = parent_.find(".card_name").html()
		showAlert($.t("CANCEL_SERVICE"),$.t("CANCEL_SERVICE_CONFIRMATION")+ serviceName+"?",function(){
			loginInfo(function(doc){
				var tempObj = {
					id: parent_.attr("id").substr(6),
					guestId: doc.estates[estateSelected].guestId
				}
				console.log(tempObj)
				_post("/condominus/service/byGuest/delete",tempObj,function(data){
					showInfoD($.t("REQUEST_CANCELED"),$.t("SERVICE_MESSAGE_1")+serviceName+$.t("SERVICE_CANCEL_MESSAGE_1"))
					parent_.remove()
				},function(err){
					showInfoD($.t("ERROR"),$.t("ERROR_CANCELING_SERVICE"))
				})
			})
		})
	}
})



service = {
	init : function(){
		$(".loading").fadeIn()
		getServiceList()
		
	}
}

servicePage = {
	init : function(t,id){
		currentServiceId = id;
		$("#ServiceNav .title").html($(t).find(".card_name").html())
		replaceServiceInfo()
		db.get("service"+id).then(function(doc){
			replaceServiceInfo(doc)
			requestOneService(id,doc.version)
		}).catch(function(err){
			requestOneService(id,0)
		})
		
	}
}


