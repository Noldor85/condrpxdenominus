$(".loginBtn--google").tapend(function(){
  window.plugins.googleplus.login(
      {

      },
      function (obj) {
        alert(JSON.stringify(obj)); // do something useful instead of alerting 
      },
      function (msg) {
        alert('error: ' + msg);
      }
  );
})