const regex = /^(data:.*\/.*?;base64,)(.*)$/
chatBar ="";
prevEvent = null;
currentChat = null;

  w = new Worker("js/chat_worker.js");
  w.onmessage = function(event){
	    console.log(event.data);
	  retData = JSON.parse(event.data)
	  if(retData.tid != undefined){
		  $("#"+retData.tid).attr("id","msg_"+retData.chatMessageId).find(".fa-clock-o").removeClass("fa-clock-o").addClass("fa-paper-plane-o")
		  console.log("change")
	  }
   
};





selectingMsg = function(e){
	if((e.type == "tapend" &&  $(".chat_message.selected").length==0)||prevEvent== "taphold" || !checkPress(e)){
	}else{
		e.stopPropagation()
		$(this).toggleClass("selected")
		if($(".chat_message.selected").length>0){
			if($("#ChatMsgNav").find(".fa-chevron-left").length>0){
				chatBar = $("#ChatMsgNav").html()
			}
			$("#ChatMsgNav").html('<i class="fa fa-times" aria-hidden="true"></i><span class="selQty">'+$(".chat_message.selected").length+'</span><div class="btn"><i class="fa fa-reply" aria-hidden="true"></i><i class="fa fa-clone" aria-hidden="true"></i><i class="fa fa-quote-right" aria-hidden="true"></i><i class="fa fa-trash-o" aria-hidden="true"></i></div>')
			
		}else{
			$("#ChatMsgNav").html(chatBar)
		}
	}
	prevEvent  = e.type
}

function goBottom(){
	$("#chat_lst_box").scrollTop(document.getElementById("chat_lst_box").scrollHeight)
}
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




function insertMsg(from,msg){
	var dom;
	var obj
	let m;
	if ((m = regex.exec(msg.message)) !== null) {
		msg.message='<img class="prevImage" src="'+msg.message+'"/>'
	}else if(( obj = giveJson(msg.message)) !=false){
		console.log(obj)
		if(obj.attachment == false){
			msg.message = "<audio controls></audio>"
		}else{
			if(1){//if file not in disk
				msg.message = `<i class="fa fa-download big" aria-hidden="true"></i><br><span>`+obj.name+`</span>`
			}else{
				msg.message = `<i class="fa fa-file big" aria-hidden="true"></i><br>`+obj.name
				
			}
		}
		
	}
	if(msg.from == from & msg.fromType == "U"){
		 dom = $(`<div class="chat_message"><div class="i_said" id="`+msg.chatId+`">`+msg.message+`<div class="said_date">`+(new Date(msg.writeDate).toLocaleString())+`</div></div></div>`)
	}else{		
		 dom = $(`<div class="chat_message"><div class="he_said" id="`+msg.chatId+`">`+msg.message+`<div class="said_date">`+(new Date(msg.writeDate).toLocaleString())+`</div></div></div>`)
		
	}
	
	if($("#msg"+chat.chatId).length>0){
			$("#"+msg.chatId).replaceWith(dom)
	}else{
			$("#chat_lst_box").prepend(dom)
	}
	console.log(dom)
	
	dom.taphold(selectingMsg).tapend(selectingMsg)
	return dom
	
}

function insertChat(chat){
	var dom = $(`<div id="`+ chat.id+`"  class="chat_lst_element" section-target="msgChat" section-title="Chat" section-fx-parameters="'`+ chat.chatId+`'">
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
	var dom = $(`<div id="`+contact.id+`" class="chat_contact" type="`+type+`" section-target="msgChat" section-fx-parameters="'`+contact.chat+`'" section-title="Chat" >
					<i class="fa fa-`+type+`"></i> <span class="chat_lst_element_who">`+ contact.name+`</span> 
				</div>`)
	$('[tab-name='+(type=="user"? "Employee" : "Department")+']').append(dom)
}

$(document).on("tapend","#ChatMsgNav .fa-times",function(){
	$("#ChatMsgNav").html(chatBar)
	$(".chat_message.selected").removeClass("selected")
})

$(document).on("tapend","#ChatMsgNav .fa-trash-o",function(){
	showAlert("Eliminar Mensajes","Desea eliminar "+$(".chat_message.selected").length+" mensajes",function(){
		$("#ChatMsgNav").html(chatBar)
		$(".chat_message.selected").remove()
	},function(){})
	
})

$(document).on("tapend",".fa-download",function(){
	var this_ = $(this)
	loginInfo(function(doc){
			var tempObj = {
				to : doc.estates[estateSelected].guestId,
				toType : userType,
				chatMessageId: this_.parent().attr("id"),
				received : true
			}
			console.log(tempObj)
		_post("/chat/read/message/validate",tempObj,function(data){
			console.log(data)
			try{
				
					//downloader.get("http://54.212.218.84:2591/downloader/1.0/read/message/"+data.uid+"/"+this_.next().next().html());
					cordovaHTTP.downloadFile("http://54.212.218.84:2591/downloader/1.0/read/message/"+data.uid+"/"+this_.next().next().html(), {}, { }, "file:///"+this_.next().next().html(), function(entry) {
						// prints the filename
						console.log(entry.name);
						
						// prints the filePath
						console.log(entry.fullPath);
						console.log("en teoria bajo")
					}, function(response) {
						console.error(response.error);
					});
					
			}catch(e){
				console.log(e)
			}
		
			//window.open("http://54.212.218.84:2591/downloader/1.0/read/message/"+data.uid+"/"+this_.next().next().html());
		},function(e){console.log(e); showInfoD("Error","Imposible obtener ruta segura")})
	})
})

$(document).on("tapend",".prevImage",function(ev){
	if(checkPress(ev)){
		$("#imgPreview").css({"background-image" :"url("+ $(this).attr("src")+")"}).fadeIn()
	$("#imgPreview_actionBar").slideDown()
	}
})

$(document).on("tapend","#imgPreview",function(ev){
	$("#imgPreview_actionBar").slideToggle()
})

$(document).on("tapend","#imgPreview_actionBar .fa-times",function(ev){
	ev.stopPropagation();
	$("#imgPreview").fadeOut();
})




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
		var tid = uuid()
		$("#chat_lst_box").append('<div class="chat_message"><div class="i_said">'+$("#chat_sender_txt").html()+'<div class="said_date">20/01/2010 15:20</div></div></div>');
		goBottom();
		$("#chat_sender_txt").html("")
		loginInfo(function(doc){
			var tempObj  = {
				from : doc.estates[estateSelected].guestId,
				fromType : userType,
				writeDate : (new Date()).getTime(),
				tid: tid, // id temporal mientras q be devuelve el real
				message: $("#chat_sender_txt").html(),
				attachment : false
			}
			if(currentChat.chatType == "contact"){
				tempObj.to 		=  currentChat.to
				tempObj.toType 	=  currentChat.toType
			}else{
				tempObj.chatId = currentChat.chatId
			}
			_post("/chat/write/app",tempObj,function(data){
				console.log(data)
			})
		})
	}
});


chat = {
	init: function(){ 	
		
		$('[tab-name=Employee]').html("")
		$('[tab-name=Department]').html("")
		this.getChats()
		this.getContactLists()
	},

	getChats : function(){
		loginInfo(function(doc){
			var tempObj = {
				to : doc.estates[estateSelected].guestId,
				toType : userType
			}
			db.get4Guest("chat",doc.userId).then(function(doc1){
				doc1.chats.forEach(function(chat){
					insertChat(chat)
				})
				tempObj.version = doc1.version
				_post("/chat/read/app",tempObj,function(data){
					console.log(data)
					if($.isEmptyObject(data)){
						console.log(data)
						data= doc1;
					}else{
						data.chats = data.chats.concat(doc1.chats)
					}
					db.upsert4Guest("chat",doc.userId,data)
					data.chats.forEach(function(chat){
						insertChat(chat)
					})
				},function(e){
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
				},function(e){})
			})
			
		})
	},

	getContactLists : function (){
		loginInfo(function(doc){
			var tempObj = {
				to : doc.estates[estateSelected].guestId,
				toType : userType
			}
			db.get("contacts").then(function(doc){
				tempObj.userVersion = doc.userVersion 
				tempObj.groupVersion = doc.groupVersion 
				doc.users.forEach(function(user){
					insertChatContact(user,"user")
				})
				doc.groups.forEach(function(group){
					insertChatContact(group,"users")
				})
				
				_post("/chat/read/users/groups",tempObj,function(data){
					
					data.users.forEach(function(user){
						insertChatContact(user,"user")
					})
					data.groups.forEach(function(group){
						insertChatContact(group,"users")
					})
					
					data.users.concat(doc.users)
					data.groups.concat(doc.groups)
					db.upsert("contacts",data)
				},function(e){
					//showInfoD("Error","No se pudo descargar las listas de contactos")
				})
			}).catch(function(e){
				_post("/chat/read/users/groups",tempObj,function(data){
					data.users.forEach(function(user){
						insertChatContact(user,"user")
					})
					data.groups.forEach(function(group){
						insertChatContact(group,"users")
					})
					db.upsert("contacts",data)
				},function(e){
					showInfoD("Error","No se pudo descargar las listas de contactos")
				})
			})
				
		})
	}
}


msgChat = {
	init :	function(this_,chatId){
		if(chatId != "'null'"){
			currentChat = {chatId : chatId,chatType : "chat"}
		}else{
			currentChat = {to : $(this_).attr("id"), toType : $(this_).attr("type") == "user" ? "U" : "G", chatType : "contact"}
		}
		console.log(chatId)
		console.log($(this_))
		$("#ChatMsgNav div").html($(this_).find(".chat_lst_element_who").html())
		loginInfo(function(doc){
			var tempObj = {
				chatId: chatId,
				to : doc.estates[estateSelected].guestId,
				toType : userType
			}
			db.get4Guest("chatId"+chatId,doc.userId).then(function(oldMsg){
				try{
					$("#chat_lst_box").html("")
					console.log(oldMsg)
				oldMsg.messages.forEach(function(chat){
					insertMsg(doc.userId,chat)
				})
				console.log(oldMsg)
				tempObj.version = oldMsg.messages.reduce(function(a,b){
					return Math.max(a,b.version)
				},0)
				console.log(tempObj);
			
				
				_post("/chat/read/app",tempObj,function(data){
					console.log(data)
					var incommingId = data.map(function(o){return o.chatId})
					data.concat(oldMsg.messages.filter(function(o){return (incommingId.indexOf(o.chatId)== -1)}))
					db.upsert4Guest("chatId"+chatId,doc.userId,data)
					data.forEach(function(chat){
						insertMsg(doc.userId,chat)
					})
					goBottom();
				},function(e){
					oldMsg.messages.forEach(function(chat){
						insertMsg(doc.userId,chat)
					})
					goBottom();
					
				})
				}catch(e){console.log(e)}
				
				
				
				
			}).catch(function(e){
				_post("/chat/read/app",tempObj,function(data){
					console.log(data)
					console.log(e)
					db.upsert4Guest("chatId"+chatId,doc.userId,{messages : data})
					data.forEach(function(chat){
						insertMsg(doc.userId,chat)
					})
					goBottom();
				},function(e){})
			})
		})
	}
}




