document.getElementById("chat_sender_txt").addEventListener("input", function() {
    if($("#chat_sender_txt").text() != ""){
		$("#chat_sender_btn .fa-microphone").removeClass("fa-microphone").addClass("fa-paper-plane");
	}else{
		$("#chat_sender_btn .fa-paper-plane").removeClass("fa-paper-plane").addClass("fa-microphone");
	}
}, false);


$("#chat_sender_btn").tapend(function(){
	if($("#chat_sender_btn .fa-microphone").length >0 ){
	}else{
		$("#chat_lst_box").append('<div class="chat_message"><div class="i_said">'+$("#chat_sender_txt").text()+'<div class="said_date">20/01/2010 15:20</div></div></div>');
	}
});


function makeChatSwipe (selector){
	$(selector).swipe({
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(".chat_lst_element").not($(this)).animate({"margin-left" : 0+"px"}); 
			var thisMarginLeft = 0-parseInt($(this).css("margin-left").replace("px",""));
			if(thisMarginLeft > 30){
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
				if(distance > 0 & distance < 70){
					$(this).css({"margin-left" : "-" + distance + "px"})
				}
			}
		 },
		  allowPageScroll:"vertical",
			threshold:5
	})
}

makeChatSwipe(".chat_lst_element")