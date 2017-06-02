function fillUserConfig(obj){
	var properties = "";
	for(var p = 0; p <  properties.length;  p++){
		properties = '<option value="'+properties[p].estateId+'">'+properties[p].identifier+'</option>'
	}
	$("myProperties").append(properties);
}