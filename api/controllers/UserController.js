/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

 var passport = require('passport');
 
module.exports = {
  
  mypage: function (req, res) {
    res.view({user:req.user});
  },
  
  me: function(req, res) {
    res.send(req.user?req.user:{});
  },
  
  add_songlist: function(req, res){
    if (req.body.song_id) {
      User.findOne(req.user.id).exec(function(err, user){
        if (err) return res.serverError(err);
        user.song_lists.add(req.body.song_id);
        user.save(function(err){
          res.send(user);
        });
      });
    }
  },
  
  delete_songlist: function(req, res){
    if (req.body.song_id) {
      User.findOne(req.user.id).exec(function(err, user){
        if (err) return res.serverError(err);
        user.song_lists.remove(req.body.song_id);
        user.save(function(err){
          res.send(user);
        });
      });
    }
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

};
