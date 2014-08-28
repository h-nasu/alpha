/**
 * FileController
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

// https://www.npmjs.org/package/skipper

// https://www.npmjs.org/package/gridfs-stream
// http://stackoverflow.com/questions/21707001/gridfs-and-sailsjs

/*
../../assets/user_id/artist_name/image.jpg
../../assets/user_id/artist_name/album_name/image.jpg
../../assets/user_id/artist_name/album_name/song.mp3
*/

// image resizing.

var fs = require('fs');

module.exports = {
  
  upload: function(req, res){
    switch (req.body.upload_type) {
      case 'artist_cover_image':
        req.file('artist_image').upload(
          function (err, files) {
            if (err) return res.serverError(err);
            Artist.findOne(req.body.artist_id).exec(function(err, artist){
              if (err) return res.serverError(err);
              if (artist.cover_image) {
                fs.unlink(artist.cover_image, function (err) {
                  if (err) throw err;
                });
              }
              artist.cover_image = files[0].fd;
              artist.save(function(err){
                if (err) return res.serverError(err);
                return res.redirect('/user/mypage#!manageArtist');
              });
            });
        });
        break;
      case 'album_cover_image':
        req.file('album_image').upload(
          function (err, files) {
            if (err) return res.serverError(err);
            Album.findOne(req.body.album_id).exec(function(err, album){
              if (err) return res.serverError(err);
              if (album.cover_image) {
                fs.unlink(album.cover_image, function (err) {
                  if (err) throw err;
                });
              }
              album.cover_image = files[0].fd;
              album.save(function(err){
                if (err) return res.serverError(err);
                return res.redirect('/user/mypage#!manageAlbum/'+album.artist);
              });
            });
        });
        break;
      case 'song_file':
        req.file('song').upload(
          function (err, files) {
            if (err) return res.serverError(err);
            Song.findOne(req.body.song_id).exec(function(err, song){
              if (err) return res.serverError(err);
              if (song.file) {
                fs.unlink(song.file, function (err) {
                  if (err) throw err;
                });
              }
              song.file = files[0].fd;
              song.save(function(err){
                if (err) return res.serverError(err);
                return res.redirect('/user/mypage#!manageSong/'+song.album);
              });
            });
        });
        break;
      default:
        res.send(200, req.body);
        break;
    }
  },
  
  download: function(req, res){
    if (!req.param('download_type')) return res.send('200');
    switch (req.param('download_type')) {
      case 'artist_cover_image':
        Artist.findOne(req.param('artist_id')).exec(function(err, artist){
          if (err) return res.serverError(err);
          if (!artist) return res.send('404');
          if (artist.cover_image) {
            res.download(artist.cover_image, artist.cover_image, function(err){
              if (err) return res.serverError(err);
            });
          }
        });
        break;
      case 'album_cover_image':
        Album.findOne(req.param('album_id')).exec(function(err, album){
          if (err) return res.serverError(err);
          if (!album) return res.send('404');
          if (album.cover_image) {
            res.download(album.cover_image, album.cover_image, function(err){
              if (err) return res.serverError(err);
            });
          }
        });
        break;
      case 'song_file':
        Song.findOne(req.param('song_id')).exec(function(err, song){
          if (err) return res.serverError(err);
          if (!song) return res.send('404');
          if (song.file) {
            // add content type to header
            var header = {};
            
            //var path = require('path');
            var mime = require('mime');
            var mimetype = mime.lookup(song.file);
            header["Content-type"] = mimetype;
            
            //res.setHeader('Access-Control-Allow-Headers', 'range, accept-encoding');
            header["Access-Control-Allow-Headers"] = 'range, accept-encoding';
            
            fs.readFile(song.file, "binary", function(err, file) {
              //TODO: any more clean solution ?
              if(typeof req.headers.range !== 'undefined')
              {
                // browser wants chunged transmission
           
                var range = req.headers.range; 
                var parts = range.replace(/bytes=/, "").split("-"); 
                var partialstart = parts[0]; 
                var partialend = parts[1]; 
           
                var total = file.length; 
           
                var start = parseInt(partialstart, 10); 
                var end = partialend ? parseInt(partialend, 10) : total-1;
           
                header["Content-Range"] = "bytes " + start + "-" + end + "/" + (total);
                header["Accept-Ranges"] = "bytes";
                header["Content-Length"]= (end-start)+1;
                header['Transfer-Encoding'] = 'chunked';
                header["Connection"] = "close";
           
                res.writeHead(206, header); 
                // yeah I dont know why i have to append the '0'
                // but chrome wont work unless i do
                res.write(file.slice(start, end)+'0', "binary");
              }
              else
              {
                // reply to normal un-chunked req
                res.writeHead(200, header );
                res.write(file, "binary");
              }
              res.end();
            });
          }
        });
        break;
      default:
        res.send('200');
        break;
    }
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

};
