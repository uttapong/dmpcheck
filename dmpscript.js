function async(u, c) {
  var d = document,
  t = 'script',
  o = d.createElement(t),
  s = d.getElementsByTagName(t)[0];
  o.src = '//' + u;
  if (c) {
  o.addEventListener('load', function (e) {
      c(null, e);
  }, false);
  }
  s.parentNode.insertBefore(o, s);
}
async('p3.isanook.com/jo/0/mu/evt/survey/js/script_sdk.min.js', function () {
  StatAsync.init('sanookStat', 'usersAct');
  //StatAsync.collectListener();
});

  /*intranet authened user's data*/
  var birthDate = "1984-07-21"; //birthdate in format YYYY-MM-DD
  var gender = "female";// ONLY 'male' or 'female' (case sensitive)
  var email = "email@domain.com"; // user's email

  window.onload = function(e) {
    // console.log($.cookie('dmp_collector'));
    // alert('adfdf');
    var isExistsCookie=/^(.*;)?\s*dmpcollector\s*=/.test(document.cookie);
    if (isExistsCookie) {
      // alert('redirect to dashboard');
      // window.location.href = "http://intranet.sanookonline.co.th/dashboard";
      return;
    }
    else{
      setTimeout(function() { 
        StatAsync.collectEvent('sanookSurvey', 'sanookInternal', {
          'c1': birthDate,
          'c2': gender,
          'c3': email
        });
      }, 2000);
        
      // createCookie('dmpcollector','done',100);
    }
  };

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}