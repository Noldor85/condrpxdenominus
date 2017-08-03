function requestPeopleDOM(){
	return $('<div class="people"><div class="chat_lst_element_picture"><i class="fa fa-user"></i></div><div class="chat_lst_element_info"><div class="chat_lst_element_who"></div><div class="people_lst_elemen"></div><div class="people_lst_elemen"></div><div class="people_lst_elemen"></div></div><div class="chat_lst_element_right"> <div class="call"> <i class="fa fa-phone" aria-hidden="true"></i></div><div class="removePeople"> <i class="fa fa-trash-o" aria-hidden="true"></i></div></div></div>')
}


function requestPlateDOM(){
	return $(`<tr>
				<td><input placeholder="`+$.t("PLATE")+`"></td>
				<td>
					<select>
						<option value="L">`+$.t("CAR")+`</option>
						<option value="M">`+$.t("MOTORCYCLE")+`</option>
						<option value="C">`+$.t("CARGO_TRUCK")+`</option>
						<option value="D">`+$.t("DIPLOMATIC_CAR")+`</option>
					</select>
				</td>
				<td>
					<div class="fa fa-trash-o"></div>
				</td>
			</tr>`)
					
}

function getPlatesObj(typeSelector){
	var retArr = []
	
	$(typeSelector).find("#cars_table tbody tr").each(function(){
		retArr.push({
			vehicleType : $(this).find(":selected").attr("value"),
			vehicleId:	$(this).find("input").val()
		})
	})
	
	return retArr;
}


function requestOnePerson(guestId,version,estate,replaceFx,t,doc){
	var tempObj = {
		guestId : guestId,
		version : version,
		plateVersion : doc == undefined ? 0 : doc.plateVersion
	}
	$(".loading").fadeIn()
	_post("/condominus/guest/read/byId",tempObj,function(data){
		$(".loading").fadeOut()
		if(doc != undefined){
			if(data.version == doc.version){data.guest =  doc.guest}
			if(data.plateVersion == doc.plateVersion){data.plates =  doc.plates}
		}
		db.upsert4Guest("person"+currentPersonId,estate.guestId,data)
		console.log("requestOnePerson",t)
		replaceFx(data,estate,t)
	})
}

function getOnePerson(personId,estate,replaceFx,t){
	console.log("getOnePerson_t",t)
	db.get4Guest("person"+personId,estate.guestId).then(function(doc){
		replaceFx(doc,estate,t)
		requestOnePerson(personId,doc.version,estate,replaceFx,t,doc)
	}).catch(function(err){
		requestOnePerson(personId,0,estate,replaceFx,t,undefined)
	})
}



function makePeopleSwipe(selector){
	return $(selector).swipe({
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(".people").not($(this)).animate({"margin-left" : 0+"px"}); 
			var thisMarginLeft = 0-parseInt($(this).css("margin-left").replace("px",""));
			if(thisMarginLeft > 99){
				$(this).animate({"margin-left" :-160+"px"});
			}else if(thisMarginLeft > 30  && thisMarginLeft < 100){
				$(this).animate({"margin-left" :-70+"px"});
			}else{
				$(this).animate({"margin-left" : 0+"px"});
			}
		},
		swipeRight:function(event, direction, distance, duration, fingerCount){
			$(this).animate({"margin-left" :0+"px"});
		},
		
		swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection){
			if(direction == "left"){
				if(distance > 0 & distance < 161){
					$(this).css({"margin-left" : "-" + distance + "px"})
				}
			}
		 },
		  allowPageScroll:"vertical",
			threshold:5
	})
}


function makePepleSwipe (selector){
	$(selector).swipe({
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(".swipe_area").not($(this)).animate({"margin-left" : 0+"px"});
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

scanPDF417ErrorCode = function(err){
	var s;
			switch(err.status){
				case 600:
					s = $.t("BAD_ARGS")
				break;
				
				case 601:
					s = $.t("BAD_USER")
				break;
				
				case 602:
					s = $.t("BAD_PERSON")
				break;
				
				case 603:
					s = $.t("USER_NOT_AUTH")
				break;
				
			default:
						s= $.t("ERROR_GENERIC_2")
					break;
						
			}
			showInfoD($.t("ERROR_SCANNING"), s)
			console.log(JSON.stringify(err))			
}

creationPeopleErrorCode = function(err){
			var s;
			switch(err.status){
				case 600:
					s = $.t("ERROR_HABITANT_GUEST_NOT_AUTHORIZED")
				break;
				
				case 601:
					s = $.t("ERROR_MAX_HABITANTS")
				break;
				
				case 602:
					s = $.t("ERROR_MAX_ENTRIES")
				break;
				
				case 603:
					s = $.t("ERROR_HABITANT_NOT_FOUND")
				break;
				
				case 604:
					s = $.t("ERROR_HABITANT_IS_NOT_USER")
				break;
				
				case 605:
					s = $.t("ERROR_HABITANT_IS_NOT_O_T_G")
				break;
				
				case 606:
					s = $.t("ERROR_TENANT_UPSERT_OWNER")
				break;
				
				case 607:
					s = $.t("ERROR_HABITANT_UPSERT_GUEST")
				break;
				
				case 608:
					s = $.t("ERROR_TENANT_ALREADY_EXIST")
				break;
				
				case 609:
					s = $.t("ERROR_GUEST_DUPLICATE")
				break;
				
				default:
						s= $.t("ERROR_GENERIC_2")
					break;
						
				}
				showInfoD($.t("ERROR_CREATING"), s)
				console.log(JSON.stringify(err))
			
						
			
		}
$(document).on("tapend",".call:not(.inactive)",function(ev){
	if(checkPress(ev)){
		console.log("llamando",$(this).attr("phone-number"))
		phonedialer.dial(
		  $(this).attr("phone-number"), 
		  function(err) {
			if (err == "empty") alert($.t("UNKNOWN_PHONE_NUMBER"));
			else showInfoD($.t("ERROR_CALLING"),$.t("ERROR_GENERIC"))   
		  },
		  function(success) { }
		 );
	}
})

$(document).on("tapend",".removePeople",function(ev){
	var this_ = $(this)
	if(checkPress(ev)){
		ev.stopPropagation()
		showAlert($.t("DELETE_PERSON"),$.t("DELETE_PERSON_CONFIRMATION"),function(){
			loginInfo(function(doc){
				var estate = doc.estates[estateSelected]
				var tempObj =	{
					authorizer : estate.guestId,
					guestId: this_.parents(".people").attr("id").substr(3)
				}
				
				_post("/condominus/guest/delete",tempObj,function(){
					showInfoD($.t("DELETED_PERSON_HEADER"),$.t("DELETED_PERSON_DETAIL"))
					this_.parents(".people").remove()
				},function(){
					showInfoD($.t("ERROR_DELETING"),$.t("ERROR_DELETING_PERSON"))
				})
				
			})
		},function(){})
	}
})


$(document).on("tapend",".internalMenu",function(ev){
	
	$(".internalMenu").fadeOut();
	$(".circle .label").fadeOut();
	$(".circle.left").animate({"margin-left": "-50px", "margin-top": "-50px"},function(){})
	$(".circle.top").animate({"margin-left": "-50px", "margin-top": "-50px"},function(){})
	$(".circle.right").animate({"margin-left": "-50px", "margin-top": "-50px"},function(){})
	$(".circle.bottom").animate({"margin-left": "-50px", "margin-top": "-50px"},function(){})
})


$(document).on("tapend",".circle.left",function(ev){
	$(".circle.active").removeClass("active");
	$(this).addClass("active")
	
	$("#"+internalMenuTarget+"Info").removeClass("active");
	$("#"+internalMenuTarget+"Code").removeClass("active");
	$("#"+internalMenuTarget+"Car").addClass("active")
	$("#"+internalMenuTarget+"Bookmark").addClass("active")

	if (internalMenuTarget === "employee") {
		getInOutEmployeeLog()
	}
})

$(document).on("tapend",".circle.top",function(ev){
	$(".circle.active").removeClass("active");
	$(this).addClass("active")
	
	$("#"+internalMenuTarget+"Car").removeClass("active");
	$("#"+internalMenuTarget+"Code").removeClass("active");
	$("#"+internalMenuTarget+"Bookmark").removeClass("active");
	$("#"+internalMenuTarget+"Info").addClass("active")
})

$(document).on("tapend",".circle.right",function(ev){
	$(".circle.active").removeClass("active");
	$(this).addClass("active")
	
	cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + binaryAgent(result.text) + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
				
				console.log(HexWhirlpool(binaryAgent(result.text)))
				loginInfo(function(doc){
						var estate = doc.estates[estateSelected]				
						var tempObj ={
							"guestId" : currentPersonId,
							"temporalCode" : false,
							"entryCode" : HexWhirlpool(binaryAgent(result.text)),
							"authorizer" : estate.guestId
						}
						if(currentPersonId != -1){
							_post("/condominus/guest/manage/changeEntryCode",tempObj,function(){
							$(".circle.bottom").hide()
							showInfoD("Éxito","Identificación asociada")
								
							},scanPDF417ErrorCode)
						}else{
							$(".circle.bottom").hide()
							currentPersonIdCode = HexWhirlpool(binaryAgent(result.text))
							showInfoD("Éxito","Código Asociado")
						}
						
				})
      },
      function (error) {
          showInfoD($.t("ERROR"),$.t("ID_NOT_RECOGNIZED"))
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: false ,// Android, save scan history (default false)
          prompt : $.t("ID_PROMPT_MESSAGE"), // Android
          resultDisplayDuration: 3500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
 
      }
   );
	
})

$(document).on("tapend",".shareBtn",function(ev){
	window.plugins.socialsharing.share($.t("PDF47_CODE_MESSAGE"), null, document.getElementById(internalMenuTarget+"CodeCanvas").toDataURL("image/jpeg",1), $.t("APP_URL"))
})

$(document).on("tapend",".circle.bottom",function(ev){
	$(".circle.active").removeClass("active");
	$(this).addClass("active")
	
	$("#"+internalMenuTarget+"Info").removeClass("active");
	$("#"+internalMenuTarget+"Car").removeClass("active");
	$("#"+internalMenuTarget+"Bookmark").removeClass("active");
	$("#"+internalMenuTarget+"Code").addClass("active");
	$("#internalMenuTargeCode").addClass("active")
})





$(document).on("tapend",".save_btn",function(ev){
	tarObj = window[$(this).parents("[section-name]").attr("section-name")]
	var errors = tarObj.validate()
	if( errors.length >0 ){
		
	}else{
		tarObj.getSaveObj()
	}
})

$(document).on("tapend",".add_car_btn",function(ev){
	if(checkPress(ev)){
		$(this).parents("#cars_table").find("tbody").prepend(requestPlateDOM())
	}
})

$(document).on("tapend","#cars_table .fa-trash-o",function(ev){
	if(checkPress(ev)){

		$(this).parents("tr").remove()
	}
})
