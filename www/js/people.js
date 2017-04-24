$(".add_car_btn").tapend(function(){
	var unic_id = guid();
	$("#cars_table tbody").prepend("<tr id='"+unic_id+"'><td><input class='form_input_full'/><td><select class='select_car_type' ><option>Sedan</option><option>4x4</option><option>Moto</option></select></td><td car-id='"+unic_id+"'><i class='fa fa-trash-o' aria-hidden='true'></i></td></tr>")
	//$("#"+unic_id).select2({})
})

$("#cancel_people_btn").tapend(function(){
	showAlert("Cancelar","Desea cancelar la creación del ingreso", 
		function(){
			$("[section-target=signInHome]").trigger("tapend")
		},
		function(){
		}
	)
})

$(document).on("tapend","[car-id]",function(){
	$("#"+$(this).attr("car-id")).remove()
})


function addPeople(tab,obj){
	var newCard =	'<div class="card " id="people_'+obj.guestId+'">\
			<div class="swipe_area">\
				<div class="card_guess_id"><i class="fa fa-user" aria-hidden="true"></i></div>\
				<div class="card_guess_info">\
					<table>\
						<tbody>\
							<tr><th>'+obj.name+'</th></tr>\
							<tr><td>'+obj.personalId+'</td></tr>\
							<tr><td>Propietario</td>\
							</tr>\
						</tbody>\
					</table>\
				 </div>\
				 <div class="delete_swipe"><i class="fa fa-trash-o" aria-hidden="true"></i></div>\
			</div>\
		</div>';
		
		$("[ tab-name="+tab+"]").append(newCard);
		makePepleSwipe("#people_"+obj.guestId+" .swipe_area");
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