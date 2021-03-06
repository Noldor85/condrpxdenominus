

function requestHabitantList(version,old,estate){
	
		var tempObj = {
			guestId: estate.guestId,
			estateId: estate.estateId,
			entry: false,
			version: version
		}
		console.log("requestHabitantList:tempObj",tempObj)
		$(".loading").fadeIn()
		_post("/condominus/guest/read/byEstate",tempObj,function(data){
			$(".loading").fadeOut()
			if(data.version !=null){
				if(old != undefined){
					var guests = data.guests || []
					var newIdexes =  guests.map(function(t){return t.guestId})
					var deleted = data.deleted || []
					old.guests = old.guests.filter(function(t){return newIdexes.indexOf(t.guestId) < 0 && deleted.indexOf(t.guestId) <0 })
					data.guests = old.guests.concat(guests)
				}
				db.upsert4Guest("residents",estate.guestId,data)
				data.guests.forEach(function(entry){
					addHabitant(entry,estate)
				})
			}
			
		},function(err){
			window.plugins.toast.showLongCenter($.t("ERROR_SYNC"))
		})
}



function getResidentList(estate){
	db.get4Guest("residents",estate.guestId).then(function(data){
		data.guests.forEach(function(entry){
				addHabitant(entry,estate)
		})
		requestHabitantList(data.version,data,estate)
	}).catch(function(err){
		requestHabitantList(0,undefined,estate)
	})
}




residents = {
	init : function(){
		loginInfo(function(doc){
			var estate = doc.estates[estateSelected]
			$("#hab-1").css({"display" : (estate.type == "O" || estate.type == "T" )? "block" : "none"})
			getResidentList(estate)
		})
	}
}

