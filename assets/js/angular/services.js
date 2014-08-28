'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('alpha.services', []).
  value('version', '0.1')
  .factory('GetUser', function($rootScope){
    return {
      load: function(){
      
        $rootScope.getMe = function(){
          if (!$rootScope.me) {
            socket.get('/user/me', function(res){
              $rootScope.me = res;
              $rootScope.$apply();
            })
          }
          $rootScope.getSongList();
        };
        
        $rootScope.getSongList = function(){
          var interMe = setInterval(function(){
            if ($rootScope.me) {
              clearInterval(interMe);
              socket.get('/user/'+$rootScope.me.id, function(user){
                $rootScope.song_lists = user.song_lists;
                $rootScope.$apply();
              });
            }
          }, 100);
        };
        
        $rootScope.addSongList = function(song_id){
          socket.post('/user/add_songlist', {song_id:song_id}, function(user){
            if (user.errors) {
              console.log(user);
            } else {
              $rootScope.getMe();
            }
          });
        };
        
        $rootScope.deleteSongList = function(song_id){
          socket.post('/user/delete_songlist', {song_id:song_id}, function(user){
            if (user.errors) {
              console.log(user);
            } else {
              $rootScope.getMe();
            }
          });
        };
        
        $rootScope.addPlayList = function(song, album){
          var addToPlay = function(song, album){
            var music = {};
            if (song.file) {
              music.title = song.name;
              music.artist = album.artist.name;
              music.mp3 = '/file/download/?download_type=song_file&song_id='+song.id;
              if (album.cover_image) {
                music.poster = '/file/download/?download_type=album_cover_image&album_id='+album.id;
              } else {
                music.poster = "http://www.jplayer.org/audio/poster/Miaow_640x360.png";
              }
            }
            myPlaylist.add(music);
            $rootScope.addSongList(song.id);
          };
          if (!album) {
            socket.get('/album/'+song.album, function(album){
              addToPlay(song, album);
            });
          } else {
            addToPlay(song, album);
          }
        };
        
        $rootScope.getMe();
        
      }
    };
    
  })
  ;
