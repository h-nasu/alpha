/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt-nodejs');

module.exports = {

  
  attributes: {
  	//has_many :song_lists,
    provider: 'STRING',
    uid: 'STRING',
    name: 'STRING',
    email: 'STRING',
    firstname: 'STRING',
    lastname: 'STRING',
    song_lists: {
      collection: 'Song'
    },
    active: {
      type: 'boolean',
      defaultsTo: 1,
    },
    admin: {
      type: 'boolean',
      defaultsTo: 0,
    },
    /*
    toJSON: function(){
      var obj = this.toObject();
      Song.find().where({id: obj.song_lists}).done(function(err,res){
        obj.song_list_names = res;
      });
      return obj;
    }
    */

  },

  /*
  beforeCreate: function (values, next) {
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(values.password, salt, null, function (err, hash) {
      if (err) return next(err);
      values.password = hash;
      next();
    });
  }
  */

};
