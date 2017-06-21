$(document).ready(function() {
/*  $("select").select2({
	  placeholder: "Tipo de persona",
  });*/
});

$(document).on("tapend",".checkbox",function(){
	$(this).toggleClass("check");
});




$('.timepicker').tapend(function(e){
	e.preventDefault(); 
	$('.jasj_time').show().attr("tmr-target",$(this).attr("id"));
})


//$('.timepicker').pickatime()


function uuid() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

$(function() {

	$(".get-nicer").niceScroll("div.nice-wrapper", {
		cursorwidth: "5px",
		enableobserver: true
	});
})


var addRippleEffect = function (e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'button') return false;
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

document.addEventListener('tapend', addRippleEffect, false);