
function maskCreditNumber(word){
  word = word.replace(/[a-zA-Z]/g,"")
  $("#credit_type").css({"background-image" : "url(img/card.png)"})
  if(/^3/.test(word)){
	   $("#credit_type").css({"background-position-x" : "70px"})
	    word = word.replace(/^(\d{4})$/,"$1 ")
	    word = word.replace(/^(\d{4}) (\d{6})$/,"$1 $2 ")
	    word = word.replace(/^(\d{4})(\d{6})(\d{5}).*/,"$1 $2 $3")
	    word = word.replace(/^(\d{4}) (\d{6}) (\d{5}).*/,"$1 $2 $3")
  }else{
	if(/^4/.test(word)){
		 $("#credit_type").css({"background-position-x" : "0px"})
	}else if(/^5/.test(word)){
		 $("#credit_type").css({"background-position-x" : "-75px"})
	}else if(/^6/.test(word)){
		 $("#credit_type").css({"background-position-x" : "144px"})
	}else{
		$("#credit_type").css({"background-image" : "none"})
	}
	    word = word.replace(/(\d{4})$/,"$1 ")
		word = word.replace(/(\d{4})(\d{4})(\d{4})(\d{4}).*/,"$1 $2 $3 $4")
		word = word.replace(/(\d{4} \d{4} \d{4} \d{4}).*/,"$1")
  }
  return word;
}

$("#credit_id").keyup(function(k){
      $(this).val(maskCreditNumber($(this).val()))
})

$("#credit_month").keyup(function(k){
	var word =   $(this).val()
  word = word.replace(/[a-zA-Z]/g,"")
  word = word.replace(/.*(\d{2}).*/,"$1")
      $(this).val(word)
})

$("#credit_year").keyup(function(k){
	var word =   $(this).val()
  word = word.replace(/[a-zA-Z]/g,"")
  word = word.replace(/.*(\d{4}).*/,"$1")
      $(this).val(word)
})

$("#credit_ccv").keyup(function(k){
	var word =   $(this).val()
  word = word.replace(/[a-zA-Z]/g,"")
  if(/^3/.test($("#credit_id").val())){
	word = word.replace(/.*(\d{4}).*/,"$1") 
  }else{
	word = word.replace(/.*(\d{3}).*/,"$1")  
  }
  
      $(this).val(word)
})


$("#card_scan").tapend(function(){
	CardIO.scan({
		  "requireExpiry": false,
		  "scanExpiry": true,
		  "requirePostalCode": false,
		  "restrictPostalCodeToNumericOnly": true,
		  "hideCardIOLogo": true,
		  "suppressScan": false,
		  "suppressConfirmation": false,
		  "keepApplicationTheme": true,
		  "useCardIOLogo" : true,
		  "suppressManual" : true
		} , function(a){
			$("#credit_id").val(maskCreditNumber(a.cardNumber))
		}, function(err){
			console.log("err",err)
		}
	);
})


payForm = {
	init : function(t){
		$("#completeBillInfo_item").html($(t).attr("item"))
		$("#completeBillInfo_description").html($(t).attr("description"))
		var total = 0;
		$("#billAmount").html(parseFloat($(t).attr("amount")).thousand() + " "+ $(t).attr("currency"))
		total += $(t).attr("amount");
		$("#billFee").html((total*0.05).thousand() + " "+ $(t).attr("currency"))
		total *= 1.05
		$("#billTotal").html(total + " "+ $(t).attr("currency"))
		
	}
}