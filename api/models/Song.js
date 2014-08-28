/**
 * Song
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  
  attributes: {
    //belongs_to :album_id,
  	name: {
      type: 'string',
      required: true
    },
    file: {
      type: 'string'
    },
    album: {
      model:'Album'
    },
    user: {
      model:'User'
    }
  },
  
  afterCreate: function(value, next){
    Album.findOne(value.album, function(err, album){
      album.songs.add(value.id);
      album.save(function(err){
        next();
      });
    });
  },
  
  beforeDestroy: function (criteria, next) {
    Song.findOne(criteria.where.id).exec(function(err, song){
      if (song.file) {
        var fs = require('fs');
        fs.unlink(song.file, function (err) {
          if (err) throw err;
        });
      }
      Album.findOne(song.album, function(err, album){
        album.songs.remove(song.id);
        album.save(function(err){
          next();
        });
      });
    });
  }

};