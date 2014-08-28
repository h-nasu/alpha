
var passport = require('passport');

module.exports = {
  index: function (req, res) {
      res.view();
  },

  logout: function (req, res) {
      req.logout();
      res.redirect('/');
  },
  
  
  twitter: function(req, res, next) {
    passport.authenticate('twitter', { failureRedirect: '/' },
      function (err, user) {
          req.logIn(user, function (err) {
              if (err) {
                  console.log(err);
                  res.view('500');
                  return;
              }
              res.redirect('user/mypage');
              return;
          });
      })(req, res);
  },
  // https://developers.facebook.com/docs/
  // https://developers.facebook.com/docs/reference/login/
  facebook: function (req, res) {
      passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] },
          function (err, user) {
              req.logIn(user, function (err) {
                  if (err) {
                      console.log(err);
                      res.view('500');
                      return;
                  }
                  res.redirect('user/mypage');
                  return;
              });
          })(req, res);
  },

  // https://developers.google.com/
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function (req, res) {
      passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] },
          function (err, user) {
              req.logIn(user, function (err) {
                  if (err) {
                      console.log(err);
                      res.view('500');
                      return;
                  }

                  res.redirect('/');
                  return;
              });
          })(req, res);
  },

}

