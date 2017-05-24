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
    FB.login(function(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      alter(JSON.stringify(response))
    } else {
      // The person is not logged into this app or we are unable to tell. 
      alert("no conecta");
    }
  });
})
