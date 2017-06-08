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
	return $(selector).swipe({
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
				if(distance > 0 & distance < 71){
					$(this).css({"margin-left" : "-" + distance + "px"})
				}
			}
		 },
		  allowPageScroll:"vertical",
			threshold:5
	})
}

function insertChat(chat){
	var dom = $(`<div id="`+ chat.id+`" idChat="`+ chat.chatId+`" class="chat_lst_element">
								<div class="chat_lst_element_picture">
									<i class="fa fa-user`+(chat.isGroup==1? "s" : "")+`"></i>
								</div>

								<div class="chat_lst_element_info">
									<div class="chat_lst_element_who">
										`+chat.name+`
									</div> 

									<div class="chat_lst_element_lastMsg">
										`+chat.message+`
									</div> 

									<div class="chat_lst_element_lastMsgDate">
										`+(new Date(chat.writeDate)).toLocaleString()+`
									</div> 
								</div>

								<div class="chat_lst_element_right">
									<div class="chat_lst_element_msgQty">
										`+chat.messages+`
									</div> 

									<div class="removeChat">
									    <i class="fa fa-trash-o" aria-hidden="true"></i>
									</div>
								</div>
							</div>`)

		if($("#"+chat.id).length>0){
			$("#"+chat.id).replaceWith(dom)
		}else{
			$('[tab-name=Chat]').append(dom)	
		}
		
	 	makeChatSwipe(dom)	
	 	return dom;	
}

function insertChatContact(contact,type){
	var dom = $(`<div id="`+(type=="user"? contact.userId : contact.chatGroupId)+`" class="chat_contact" type="`+type+`">
					<i class="fa fa-`+type+`"></i> <span>`+(type=="user"?contact.userName: contact.name)+`</span> 
				</div>`)
	$('[tab-name='+(type=="user"? "Employee" : "Department")+']').append(dom)
}




chat = {
	init: function(){ 	
		this.getChats()
		this.getContactLists()
	},

	getChats : function(){
		loginInfo(function(doc){
			var tempObj = {
				to : doc.userId,
				toType : "U"
			}
			db.get4Guest("chat",doc.userId).then(function(doc1){
				tempObj.version = 0//doc1.version
				_post("/chat/read/app",tempObj,function(data){
					console.log(data)
					data.chats = data.chats.concat(doc1.chats)
					db.upsert4Guest("chat",doc.userId,data)
					data.chats.forEach(function(chat){
						insertChat(chat)
					})
				}).fail(function(e){
					doc1.chats.forEach(function(chat){
						insertChat(chat)
					})
				})
			}).catch(function(e){
					_post("/chat/read/app",tempObj,function(data){
					console.log(data)
					db.upsert4Guest("chat",doc.userId,data)
					data.chats.forEach(function(chat){
						insertChat(chat)
					})
				}).fail(function(e){})
			})
			
		})
	},

	getContactLists : function (){
		_post("/chat/read/users/groups",{},function(data){
			data.users.forEach(function(user){
				insertChatContact(user,"user")
			})
			data.groups.forEach(function(group){
				insertChatContact(group,"users")
			})
		}).fail(function(e){
			showInfoD("Error","No se pudo descargar las listas de contactos")
		})
	}


}