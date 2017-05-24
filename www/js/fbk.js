  window.fbAsyncInit = function() {
    FB.init({
      appId      : '298960577183466',
      xfbml      : true,
      version    : 'v2.9'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));




$(".loginBtn--facebook").tapend(function(){
  alert(20000)
 CordovaFacebook.login({
   permissions: ['email', 'user_likes'],
   onSuccess: function(result) {
      if(result.declined.length > 0) {
         alert("The User declined something!");
      }
      /* ... */
   },
   onFailure: function(result) {
      if(result.cancelled) {
         alert("The user doesn't like my app");
      } else if(result.error) {
         alert("There was an error:" + result.errorLocalized);
      }
   }
});
 alert(20001)
  }) 
