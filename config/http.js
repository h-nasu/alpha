// https://github.com/stefanbuck/sails-social-auth-example/

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy;

/*
    , GitHubStrategy = require('passport-github').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
*/

var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
      var addInfo = {
        token: token,
        tokenSecret: tokenSecret
      }
      
      switch (profile.provider) {
        case 'twitter':
          if (profile.photos[0].value) {
            addInfo.profile_image = profile.photos[0].value;
          }
          break;
        case 'facebook':
          addInfo.profile_image = 'https://graph.facebook.com/'+profile.id+'/picture';
          break;
        default:
          break;
      }
      
        User.findOne({uid: profile.id}).exec(function (err, user) {
                if (user) {
                    user = merge_options(user, addInfo);
                    return done(null, user);
                } else {

                    var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        name: profile.displayName
                    };

                    if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    if(profile.name && profile.name.givenName) {
                        data.fistname = profile.name.givenName;
                    }
                    if(profile.name && profile.name.familyName) {
                        data.lastname = profile.name.familyName;
                    }

                    User.create(data).exec(function (err, user) {
                            user = merge_options(user, addInfo);
                            return done(err, user);
                        });
                }
            });
    });
};

passport.serializeUser(function (user, done) {
    //done(null, user.uid);
    done(null, user);
});

passport.deserializeUser(function (uid, done) {
    /*
    User.findOne({uid: uid}).done(function (err, user) {
        done(err, user);
    });
    */
    done(null, uid);
});


/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

 // middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    // order: [
    //  'startRequestTimer',
    //  'cookieParser',
    //  'session',
    //  'myRequestLogger',
    //  'bodyParser',
    //  'handleBodyParserError',
    //  'compress',
    //  'methodOverride',
    //  'poweredBy',
    //  '$custom',
    //  'router',
    //  'www',
    //  'favicon',
    //  '404',
    //  '500'
    // ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }

  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    bodyParser: require('skipper'),

  // },
  
  customMiddleware: function (app) {

      /*
      passport.use(new GitHubStrategy({
              clientID: "YOUR_CLIENT_ID",
              clientSecret: "YOUR_CLIENT_SECRET",
              callbackURL: "http://localhost:1337/auth/github/callback"
          },
          verifyHandler
      ));
      
      passport.use(new GoogleStrategy({
              clientID: 'YOUR_CLIENT_ID',
              clientSecret: 'YOUR_CLIENT_SECRET',
              callbackURL: 'http://localhost:1337/auth/google/callback'
          },
          verifyHandler
      ));
      */
      
      passport.use(new FacebookStrategy({
              clientID: "1454925348120927",
              clientSecret: "d7a32b3b03deb5847d6cb2d642113d02",
              callbackURL: "http://127.0.0.1:1337/auth/facebook/callback"
          },
          verifyHandler
      ));
      
      passport.use(new TwitterStrategy({
              consumerKey: "II399NffIrnOSVzNx4vceAgUF",
              consumerSecret: "JFnDJPvineFYrZY17zniK4GZKnBqxbur77DhANpEF5sOLoUaFb",
              callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
          },
          verifyHandler
      ));

      app.use(passport.initialize());
      app.use(passport.session());
  },
  

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
