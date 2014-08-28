/**
 * Message
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
 
  attributes: {
  	
    //belongs_to :artist_id,
    
    artist: {
      //type: 'integer',
      //required: true
      model:'Artist'
    },

    body: {
      type: 'text',
      required: true
    },
    
    user: {
      model:'User'
    }

  },
  
  afterCreate: function(value, next){
    Artist.findOne(value.artist, function(err, artist){
      artist.messages.add(value.id);
      artist.save(function(err){
        next();
      });
    });
  },
  
  beforeDestroy: function (criteria, next) {
    Message.findOne(criteria.where.id).exec(function(err, message){
      Artist.findOne(message.artist, function(err, artist){
        artist.messages.remove(message.id);
        artist.save(function(err){
          next();
        });
      });
    });
  }

};
