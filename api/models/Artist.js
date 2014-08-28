/**
 * Artist
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

 
  attributes: {
    //belongs_to :user_id,
    //has_many :albums :venus :messages,
  	name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text'
    },
    albums: {
      //type: 'array'
      collection:'Album'
    },
    venus: {
      //type: 'array'
      collection:'Venu'
    },
    messages: {
      //type: 'array'
      collection:'Message'
    },
    twitter: {
      type: 'string'
    },
    cover_image: {
      type: 'string'
    },
    active: {
      type: 'boolean',
      defaultsTo: 1
    },
    user: {
      //type: 'integer'
      model:'User'
    }
  },
  
  beforeDestroy: function (criteria, next) {
    Artist.findOne(criteria.where.id).exec(function(err, artist){
      if (artist.cover_image) {
        var fs = require('fs');
        fs.unlink(artist.cover_image, function (err) {
          if (err) throw err;
        });
      }
      next();
    });
  }
  

};