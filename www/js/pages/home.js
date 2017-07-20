function getEstateIdentifier(estates,id){
	return estates.filter(function(estate){return estate.estateId == id})[0].identifier
}

function requestDashboardInfo(){
	loginInfo(function(doc){
		var tempObj = {userId : doc.userId}
		_post("/security/dashboard",tempObj,function(data){
			
			$("#home_chats").find(".fa-comment-o").html(" "+data.chats.messages)
			$("#home_chats").find(".fa-comments-o").html(" "+data.chats.chats)
			$("#home_chats").find(".fa-home").html(" "+data.chats.estates)
			$("#home_bills").html("")
			$("#home_bookings").html("")
			//bills to be defined
		/*	
			data.bookings =   [{
            "name": "Cine Torre 2",
            "endTime": 200,
            "guestId": "1d1a81ec074551ae8520023da2e132ad",
            "estateId": "f5e90eb0e8a6684c5667aca041cf7743",
            "bookingId": "a953de58330d36c2f5109e4a2cbd2117",
            "startTime": 100,
            "identifier": "901",
            "resourceId": "da7acaad7c56a8a7c4bb0cae00d2d8ae",
            "bookingDate": 1499040000000,
            "description": "El cine de torre 2 cuenta con 18 butacas VIP, Proyector 3D. Blu-ray, Señal de cable y Netflix."
        },{
            "name": "Cine Torre 2",
            "endTime": 200,
            "guestId": "1d1a81ec074551ae8520023da2e132ad",
            "estateId": "f5e90eb0e8a6684c5667aca041cf7743",
            "bookingId": "a953de58330d36c2f5109e4a2cbd2117",
            "startTime": 100,
            "identifier": "901",
            "resourceId": "da7acaad7c56a8a7c4bb0cae00d2d8ae",
            "bookingDate": 1499040000000,
            "description": "El cine de torre 2 cuenta con 18 butacas VIP, Proyector 3D. Blu-ray, Señal de cable y Netflix."
        }]
		
		*/
		
		
		
		if($.isEmptyObject(data.bills)){
			$("#home_bills").html('<div  class="home_divs dashboard_cards"><div class="home_empty">'+$.t("EMPTY_BILLS_MESSAGE")+'</div></div>')
		}else{
			for(var estate in data.bills){
				var dom = $('<div class="bill_dashboard_card"><div class="estateidentifier">'+estate+'</div>');
				if("E" in data.bills[estate]){
					dom.append($('<div class="subtitleBillCard overdue">'+$.t("EXPIRED")+'</div>'))
					var dom2 = $('<div class="currencyCard"></div>')
					for(var currency in data.bills[estate].E){
						var dom3 = $('<div class="currencyBox"><div class="currency">'+currency+'</div><div class="amount">'+data.bills[estate].E[currency].thousand()+'</div></div>')
						dom2.append(dom3)
					}
					dom.append(dom2)
				}
				
				if("P" in data.bills[estate]){
					dom.append($('<div class="subtitleBillCard pending">'+$.t("PENDING")+'</div>'))
					var dom2 = $('<div class="flex flex-sb  currencyCard"></div>')
					for(var currency in data.bills[estate].P){
						var dom3 = $('<div class="currencyBox"><div class="currency">'+currency+'</div><div class="amount">'+data.bills[estate].P[currency].thousand()+'</div></div>')
						dom2.append(dom3)
					}
					dom.append(dom2)
				}
				$("#home_bills").append(dom)
			}
		}
		
		
		
		
		
			
			console.log(data.bookings)
			if(data.bookings!=null && data.bookings.length>0){
				console.log("yes")
				$("#home_bookings").removeClass("dashboard_cards")
				 
				 data.bookings.forEach(function(bookin){
					var stime = Int2Time(bookin.startTime)
					var etime = Int2Time(bookin.endTime)
					var dom = $('<div class="dashboard_cards"><div><div class="resourceName"></div><div class="estateName"></div><div class="resourceTime"></div><div class="guest"></div></div></div>')
					dom.find(".resourceName").html(bookin.name)
					dom.find(".resourceTime").html(zeroPad(stime.h,2)+":"+zeroPad(stime.m,2)+" - "+zeroPad(etime.h,2)+":"+zeroPad(etime.m,2))
					$("#home_bookings").append(dom)
					dom.find(".estateName").html(getEstateIdentifier(doc.estates,bookin.estateId))
				 })
				
			}else{
				$("#home_bookings").addClass("dashboard_cards")
				$("#home_bookings").html('<div class="home_empty">'+$.t("EMPTY_BOOKINGS_MESSAGE")+'</div>')
			}
			
			$(".get-nicer").getNiceScroll().resize()
			console.log(data)
		})
	})
}



home = {
	init : function(){
		requestDashboardInfo()
	}
}