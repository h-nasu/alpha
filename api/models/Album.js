/**
 * Album
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    //belongs_to :artist,
  	name: {
      type: 'string',
      required: true
    },
    cover_image: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    artist: {
      model:'Artist'
    },
    songs: {
      collection:'Song'
    },
    user: {
      model:'User'
    }
  },
  
  afterCreate: function(value, next){
    Artist.findOne(value.artist, function(err, artist){
      artist.albums.add(value.id);
      artist.save(function(err){
        next();
      });
    });
  },
  
  beforeDestroy: function (criteria, next) {
    Album.findOne(criteria.where.id).exec(function(err, album){
      if (album.cover_image) {
        var fs = require('fs');
        fs.unlink(album.cover_image, function (err) {
          if (err) throw err;
        });
      }
      Artist.findOne(album.artist, function(err, artist){
        artist.albums.remove(album.id);
        artist.save(function(err){
          next();
        });
      });
    });
  }

};