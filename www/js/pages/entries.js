
function guestGetAvailability(guest){
	if(guest.permanent==1){
		return '<font color="#0177D701DD7D">'+$.t("PERMANENT")+'</font>'
	}else{
		var now 	= new Date()
		var start	= new Date(guest.startDate)
		var ostime	= Int2Time(guest.startTime)
		
		var stime = new Date()
		stime.setHours(ostime.h)
		stime.setMinutes(ostime.m)
		stime = stime.getTime()-20*60*1000

		var etime = new Date()
		etime.setHours(ostime.h)
		etime.setMinutes(ostime.m)
		etime = etime.getTime()+60*60*1000
		
		var ntime = now.getTime()
		console.log("stime",new Date(stime).toUTCString())
		console.log("etime",new Date(etime).toUTCString())
		console.log("ntime",new Date(ntime).toUTCString())
		if(now.getUTCFullYear() == start.getUTCFullYear() && now.getUTCMonth() == start.getUTCMonth() && now.getUTCDate() == start.getUTCDate() ){
			if(stime <= ntime &&  ntime <= etime){
				return '<font color="#01DD7D">'+$.t("AUTHORIZED")+'</font>'
			}else{
				return $.t("OUT_OF_SCHEDULE")
			}
		}else{
			return $.t("ERROR_TODAY_IS_NOT_AUTHORIZED")
		}
		
	}
}


function employeeGetAvailability(guest){
	if(guest.permanent==1){
		return '<font color="#0177D701DD7D">'+$.t("PERMANENT")+'</font>'
	}else{
		var now 	= new Date()
		var start	= new Date(guest.startDate)
		var ostime	= Int2Time(guest.startTime)
		var oetime	= Int2Time(guest.endTime)
		
		var stime = new Date()
		stime.setHours(ostime.h)
		stime.setMinutes(ostime.m)
		stime = stime.getTime()-60*60*1000

		var etime = new Date()
		etime.setHours(oetime.h)
		etime.setMinutes(oetime.m)
		etime = etime.getTime()+60*60*1000
		
		var ntime = now.getTime()
		console.log("stime",new Date(stime).toUTCString())
		console.log("etime",new Date(etime).toUTCString())
		console.log("ntime",new Date(ntime).toUTCString())
		if(now.getUTCFullYear() == start.getUTCFullYear() && now.getUTCMonth() == start.getUTCMonth() && now.getUTCDate() == start.getUTCDate() ){
			if(stime <= ntime &&  ntime <= etime){
				return '<font color="#01DD7D">'+$.t("AUTHORIZED")+'</font>'
			}else{
				return $.t("OUT_OF_SCHEDULE")
			}
		}else{
			return $.t("ERROR_TODAY_IS_NOT_AUTHORIZED")
		}
		
	}
}

function requestEntryList(version,old,estate){
	
		var tempObj = {
			guestId: estate.guestId,
			estateId: estate.estateId,
			entry: true,
			version: version
		}
		console.log("requestEntryList:tempObj",tempObj)
		$(".loading").fadeIn()
		_post("/condominus/guest/read/byEstate",tempObj,function(data){
			$(".loading").fadeOut()
			if(old != undefined){
				console.log("aka9",data)
				var guests = data.guests || []
				var deleted = data.deleted || []
				var newIdexes = guests.map(function(t){return t.guestId})
				old.guests = old.guests.filter(function(t){return newIdexes.indexOf(t.guestId) < 0 && deleted.indexOf(t.guestId) <0 })
				data.guests = old.guests.concat(guests)
			}
			db.upsert4Guest("entries",estate.guestId,data)
			data.guests.forEach(function(entry){
				if(entry.type == "V"){
				addGuest(entry,estate)
				}else{
					addEmployee(entry,estate)
				}
			})
			
		},function(err){
			window.plugins.toast.showLongCenter($.t("ERROR_SYNC"))
		})
}



function getEntryList(estate){
	db.get4Guest("entries",estate.guestId).then(function(data){
		data.guests.forEach(function(entry){
			if(entry.type == "V"){
				addGuest(entry,estate)
			}else{
				addEmployee(entry,estate)
			}
		})
		requestEntryList(data.version,data,estate)
	}).catch(function(err){
		requestEntryList(0,undefined,estate)
	})
}

$(document).on("keyup",".searchBox input",function(){
	
	$("#guestList .people:contains("+$(this).val()+")").show()
	$("#guestList .people:not(:contains("+$(this).val()+"))").hide()
})


$(document).on("tapend",".search_btn",function(){
	$(this).fadeOut()
	$(".searchBox").slideDown()
	$(this).parent().addClass("showSearch")
	$("#guestList").addClass("withSearchBox")
	$(".get-nicer").getNiceScroll().resize()
})

$(document).on("tapend",".searchCancel",function(){
	$(".search_btn").fadeIn()
	$(".searchBox").slideUp()
	$(this).parents(".tab-listtab").removeClass("showSearch")
	$("#guestList").removeClass("withSearchBox")
	$(".get-nicer").getNiceScroll().resize()
})

entries = {
	init : function(){
		loginInfo(function(doc){
			var estate = doc.estates[estateSelected]
			getEntryList(estate)
			$("#emp-1").css({"display" : (estate.type == "O" || estate.type == "T" ) ? "block" : "none"})
		})
		
	}
}

