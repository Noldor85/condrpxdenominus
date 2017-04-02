
var dw = ["D","L","K","M","J","V","S"];
var mt = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
function createDateCoursel(tbl,year,month){
	var dayNames 	= "";
	var dayNumbers 	= "";
	var pointerDate   = new Date(year,month,1,0,0,0,0).getDay();
	
	for (var i = 1; i <= Date.getDaysInMonth(year, month); i++){
		dayNumbers += "<td>"+i+"</td>";
		dayNames += "<td>"+dw[(pointerDate%7)]+"</td>";
		pointerDate++;
	}
	$(tbl).css({"width" : (i*36)+"px"}).html("<tr>"+dayNames+"</tr><tr>"+dayNumbers+"</tr>")
}


function calendarMonth(tbl,year,month){
	var pointerDate   = new Date(year,month,1,0,0,0,0).getDay();
	var dayNumbers = "<table><tr><td id='prev_month'><i class='fa fa-chevron-left' aria-hidden='true'></i></td><td style='width:110px'>"+mt[month]+"</td><td id='next_month'><i class='fa fa-chevron-right' aria-hidden='true'></i></td><td id='prev_year'><i class='fa fa-chevron-left' aria-hidden='true'></i></td><td>"+year+"</td><td id='next_year'><i class='fa fa-chevron-right' aria-hidden='true'></i></td></tr></table><table class='jasj_sch_day'><tr><th>D</th><th>L</th><th>K</th><th>M</th><th>J</th><th>V</th><th>S</th></tr><tr>"
	for(var e=0 ; e< pointerDate; e++){
		dayNumbers += "<td></td>"
	}
	for (var i = 1; i <= Date.getDaysInMonth(year, month); i++){
		dayNumbers += "<td>"+i+"</td>";
		if(pointerDate%7 == 6) dayNumbers += "</tr><tr>"
		pointerDate++;
	}
	$(tbl).html(dayNumbers +"</tr></table><table class='navCalendar'><tr><td class='sch_clean'>LIMPIAR</td><td d class='sch_cancel'>CANCELAR</td><td d class='sch_acept'>ACEPTAR</td></tr></table>")
}

function getSch(){
	if($(".selected_sch_day").length > 0){
		return  $(".selected_sch_day").text()+"/"+(jasjMonth+1)+"/"+jasjYear
	}else{
		return "";
	}
}

createDateCoursel(".pick_cursel_day",2017,3)
calendarMonth(".jasj_calendar",2017,3)


$(document).on("tapend",".pick_cursel_day tr:nth-child(2) td",function(ev){
	if(checkPress(ev)){
		$(this).toggleClass("selected_cur_day");
	}
})

var jasjMonth = 3;
var jasjYear = 2017;



$(document).on("tapend","#prev_month",function(){
	jasjMonth --;
	if(jasjMonth < 0) { jasjYear --; jasjMonth= 11;}
	calendarMonth(".jasj_calendar",jasjYear,jasjMonth)
})

$(document).on("tapend","#next_month",function(){
	jasjMonth ++;
	if(jasjMonth > 11) { jasjYear ++; jasjMonth= 0;}
	calendarMonth(".jasj_calendar",jasjYear,jasjMonth)
})

$(document).on("tapend","#next_year",function(){
	jasjYear ++;
	calendarMonth(".jasj_calendar",jasjYear,jasjMonth)
})

$(document).on("tapend","#prev_year",function(){
	jasjYear --;
	calendarMonth(".jasj_calendar",jasjYear,jasjMonth)
})

$(document).on("tapend",".jasj_sch_day td",function(){
	if($(this).text()!=""){
		$(".selected_sch_day").removeClass("selected_sch_day");
		$(this).addClass("selected_sch_day");
	}
})

$(document).on("tapend",".sch_acept",function(){
	$("#"+$('.jasj_calendar').attr("sch-target")).val(getSch());
	$('.jasj_calendar').hide();
})

$(document).on("tapend",".sch_cancel",function(){
	$('.jasj_calendar').hide();
})

$(document).on("tapend",".sch_clean",function(){
	$('.jasj_calendar').hide();
	$(".selected_sch_day").removeClass(".selected_sch_day");
})

$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout,$(this)));
  });
};


$(".jasj_td_scroll").scrollEnd(function(b){
	var senpos= b.scrollTop()/20;
	var integer = parseInt(senpos)
	var decimal = Math.round(senpos-integer);
	b.scrollTop((integer+decimal)*20);
	console.log(senpos,integer,decimal)
},300)









