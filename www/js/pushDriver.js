function pushDriver(ev){
	var payload = ev.payload
	switch (payload.type){
		case "chat":
			var inTheChat =false
			if(currentChat != null){
				inTheChat = currentChat != null && ev.foreground && (currentChat.chatId == payload.chatId) && ($(".section_active").attr("section-name") == "msgChat")
			}
			console.log(inTheChat)
			console.log(ev.payload.chatId)
			getMessages(ev.payload.chatId,inTheChat,false)	
			chat.getChats()
			home.init()
			console.log(inTheChat)
			if(inTheChat){
				$(".qtyNewMsg").attr("qty",(parseInt($(".qtyNewMsg").attr("qty"))+1)).html($(".qtyNewMsg").attr("qty"))
			}
		break;
		
		default:
			console.log("this version do not recognize the type: "+ payload.type)
			chat.getChats()
		break;
	}
}


