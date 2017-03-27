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