//Main menu
$("#header_menu_btn").tapend(function(){
	//alert($("#main_menu").css("left"));
	if(true){
		$("#main_menu").animate({"left": "0px"});
		$("#modal").show();
	}
})

$("#modal").tapend(function(){
	$("#main_menu").animate({"left": "-250px"});
	$("#modal").hide();
	$("#user_config").hide();
})


$(document).on("tapend","[section-target]",function(ev){
	console.log(eval(this))
	if(checkPress(ev)){
		var title = $(this).hasAttr("section-title") ? $(this).attr("section-title") : $(this).text();
		$(".nav_li_selected").removeClass("nav_li_selected");
		$(this).addClass("nav_li_selected");
		$("#header_section_description").html(title);
		$("#main_menu").animate({"left": "-250px"});
		$("#modal").hide();
		$(".section_active").removeClass("section_active");
		$("[section-name="+$(this).attr("section-target")+"]").addClass("section_active");
	}
	
	if($(this).hasAttr("section-fx")){
		eval($(this).attr("section-fx")+"(this"+($(this).hasAttr("section-fx-parameters")?","+ $(this).attr("section-fx-parameters") : "")+")")
	}else if(eval('typeof '+$(this).attr("section-target")+'.init == "function"')){
		eval($(this).attr("section-target")+".init(this"+($(this).hasAttr("section-fx-parameters")?","+ $(this).attr("section-fx-parameters") : "")+")")
	}
	
});

//tab menu
$(document).on("tapend",".tablist>li:not(.active)",function(){
	$(".tablist[tab-group="+$(this).parent().attr("tab-group")+"]>li.active").removeClass("active");
	$(this).addClass("active");
	
	$(this).parent().parent().parent().find("[tab-name]").hide();
	$("[tab-name="+$(this).attr("tab-target")+"]").show();
})