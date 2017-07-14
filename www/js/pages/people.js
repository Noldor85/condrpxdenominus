function requestPeopleDOM(){
	return $('<div class="people"><div class="chat_lst_element_picture"><i class="fa fa-user"></i></div><div class="chat_lst_element_info"><div class="chat_lst_element_who"></div><div class="people_lst_elemen"></div><div class="people_lst_elemen"></div><div class="people_lst_elemen"></div></div><div class="chat_lst_element_right"> <div class="call"> <i class="fa fa-phone" aria-hidden="true"></i></div><div class="removePeople"> <i class="fa fa-trash-o" aria-hidden="true"></i></div></div></div>')
}


function requestPlateDOM(){
	return $(`<tr>
				<td><input placeholder="placa"></td>
				<td>
					<select>
						<option value="M">Moto</option>
						<option value="L">Liviano</option>
						<option value="C">Carga</option>
						<option value="D">Diplomatico</option>
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


creationPeopleErrorCode = function(err){
			var s;
			switch(err.status){
				case 600:
					s = "El habitante no se encuentra autorizado para crear/actualizar otros habitantes"
				break;
				
				case 601:
					s = "Se ha excedido el número máximo de residentes para el estate"
				break;
				
				case 602:
					s = "Se ha excedido el número máximo de ingresos para el estate"
				break;
				
				case 603:
					s = "No se encuentra el habitante"
				break;
				
				case 604:
					s = "El habitante no cuenta con usuario asociado"
				break;
				
				case 606:
					s = "El guest no es de tipo O, T o G"
				break;
				
				case 607:
					s = "El inquilino no puede crear/actualizar un guest de tipo owner"
				break;
				
				case 608:
					s = "Un habitante no puede crear/actualizar un guest de tipo owner, inquilino o guest"
				break;
				
				default:
						s= "algo a salido mal, consulte a su administrador"
					break;
						
				}
				showInfoD("Error en creación", s)
				console.log(JSON.stringify(err))
			
						
			
		}
$(document).on("tapend",".call:not(.inactive)",function(ev){
	if(checkPress(ev)){
		console.log("llamando",$(this).attr("phone-number"))
		phonedialer.dial(
		  $(this).attr("phone-number"), 
		  function(err) {
			if (err == "empty") alert("Unknown phone number");
			else showInfoD("Error en llamada","Algo no ha salido bien")   
		  },
		  function(success) { }
		 );
	}
})

$(document).on("tapend",".removePeople",function(ev){
	var this_ = $(this)
	if(checkPress(ev)){
		ev.stopPropagation()
		showAlert("Borrar Persona","seguro que desea borrar a esta persona",function(){
			loginInfo(function(doc){
				var estate = doc.estates[estateSelected]
				var tempObj =	{
					authorizer : estate.guestId,
					guestId: this_.parents(".people").attr("id").substr(3)
				}
				
				_post("/condominus/guest/delete",tempObj,function(){
					showInfoD("Persona Eliminada","Persona Eliminada con éxito")
					this_.parents(".people").remove()
				},function(){
					showInfoD("Error Eliminando","No se pudo eliminar a la persona")
				})
				
			})
		},function(){})
	}
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