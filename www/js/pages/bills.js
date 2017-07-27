function addBillCard(obj){
	console.log(obj)
	var dateAsArray = $("#selectMonthBill").val().split("-")
	var dueDateTime =     new Date(obj.dueDate).getTime()
	var firsDayMonthSel = new Date($("#selectMonthBill").val()+"-01").getTime()
	var lastDayMonthSel = new Date($("#selectMonthBill").val()+"-"+ Date.getDaysInMonth(dateAsArray[0],parseInt(dateAsArray[1])-1)).getTime()
	console.log("sdex",Date.getDaysInMonth(dateAsArray[0],parseInt(dateAsArray[1])-1))
	console.log("dueDateTime",dueDateTime)
	console.log("firsDayMonthSel",firsDayMonthSel)
	console.log("lastDayMonthSel",lastDayMonthSel)
	if(obj.status != "C"  || (firsDayMonthSel<=dueDateTime && dueDateTime <=lastDayMonthSel)){
		dom = $('<div class="bill"><div class="chat_lst_element_picture"><i class="fa"></i></div><div class="chat_lst_element_info"><div class="chat_lst_element_who"></div><div class="bill_description"></div><div class="bill_status"></div><div class="bill_amount"></div></div><div class="chat_lst_element_right"> <div class="pay_bill" section-target="payForm"> <i class="fa fa-credit-card-alt" aria-hidden="true"></i></div></div></div>')
		dom.attr("id","bill"+obj.id)
		dom.attr("amount",obj.amount)
		dom.find(".chat_lst_element_picture i").addClass(obj.image)
		dom.find(".chat_lst_element_who").html(obj.item)
		dom.find(".bill_description").html(obj.description)
		dom.find(".bill_amount").html(obj.amount.thousand()+ " "+obj.currency)
		
		var payBtn = dom.find(".pay_bill")
		payBtn.attr("amount",obj.amount)
		payBtn.attr("currency",obj.currency)
		payBtn.attr("item",obj.item)
		payBtn.attr("description",obj.description)
		
	
		if(obj.status == "P" && dueDateTime < new Date().getTime()){
			obj.status == "E"
		}
		switch(obj.status){
			case "E":
				dom.find(".bill_status").html($.t("OVERDUE")+normalDate(obj.dueDate))
				dom.find(".bill_status").addClass("overdue")
				if($("#bill"+obj.id).length>0){
					$("#bill"+obj.id).replaceWith(dom)
				}else{
					$("#billsPending_lst>div").append(dom)	
				}
				makeBillSwipe(dom)
				
				
			break;
			
			case "P":
				var dateNow = new Date()
				
				dom.find(".bill_status").html($.t("EXPIRES")+normalDate(obj.dueDate))
				dom.find(".bill_status").addClass("pending")
				if($("#bill"+obj.id).length>0){
					$("#bill"+obj.id).replaceWith(dom)
				}else{
					$("#billsPending_lst>div").append(dom)	
				}
				makeBillSwipe(dom)
				
				
			break;
			
			
			case "C":
				dom.find(".bill_status").html($.t("PAID_OUT")+normalDate(obj.payDate))
				dom.find(".bill_status").addClass("payed")
				
				if($("#bill"+obj.id).length>0){
					$("#bill"+obj.id).replaceWith(dom)
					$("#billsCanceled_lst>div").append($("#bill"+obj.id))
				}else{
					$("#billsCanceled_lst>div").append(dom)	
				}
			break;
			
		}
	
	}else{console.log("outOfMonth")}
	
	
	
}


function makeBillSwipe (selector){
	$(selector).swipe({
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(".bill").not($(this)).animate({"margin-left" : 0+"px"});
			var thisMarginLeft = 0-parseInt($(this).css("margin-left").replace("px",""));
			if(thisMarginLeft > 40){
				$(this).animate({"margin-left" :-100+"px"});
			}else{
				$(this).animate({"margin-left" : 0+"px"});
			}
		},
		swipeRight:function(event, direction, distance, duration, fingerCount){
			$(this).animate({"margin-left" :0+"px"});
		},
		
		swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection){
			if(direction == "left"){
				if(distance > 0 & distance < 101){
					$(this).css({"margin-left" : "-" + distance + "px"})
				}
			}
		 },
		  allowPageScroll:"vertical",
			threshold:5
	})
}


function requestBillList(version,old,estate){
		var tempObj = {
			estateId: estate.estateId,
			queryDate: new Date($("#selectMonthBill").val()+"-15").getTime(),
			version: version
		}
		console.log(tempObj)
		$(".loading").fadeIn()
		_post("/condominus/bills/read",tempObj,function(data){
			$(".loading").fadeOut()
			if(old != undefined){
				var newIdexes = data.bills.map(function(t){return t.id})
				old.bills = old.bills.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
				data.bills = old.bills.concat(data.bills)
			}
			db.upsert4Guest("bills",estate.guestId,data)
			data.bills.forEach(function(bill){
				addBillCard(bill,estate)
				
			})
			makeBillSwipe(".bill")
			
		},function(err){
			window.plugins.toast.showLongCenter($.t("ERROR_SYNC_BILLS"))
		})

}


function getBillList(estate){
	$("#billsCanceled_lst>div").html("")
	$("#billsPending_lst>div").html("")
	
	db.get4Guest("bills",estate.guestId).then(function(data){
		data.bills.forEach(function(bill){
			addBillCard(bill,estate)
			
		})
		makeBillSwipe(".bill")
		requestBillList(data.version,data,estate)
	}).catch(function(err){
		requestBillList(0,undefined,estate)
	})
}


$(document).on("change","#selectMonthBill",function(){
	loginInfo(function(doc){
		getBillList(doc.estates[estateSelected])
	})
})
	

bills = {
	init : function(){
		loginInfo(function(doc){
			var d__ = new Date()
			$("#selectMonthBill").val(d__.getFullYear()+"-"+zeroPad(d__.getMonth()+1,2))
			getBillList(doc.estates[estateSelected])
		})
		
	}
}

