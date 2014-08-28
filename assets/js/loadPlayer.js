
var playlist;
var myPlaylist;
  
$(function(){
  
  var cssSelector = {
    jPlayer: "#jquery_jplayer_1",
    cssSelectorAncestor: "#jp_container_1"
  };
  playlist = [
    {
      title:"Cro Magnon Man",
      artist:"The Stark Palace",
      mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
      oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg",
      poster: "http://www.jplayer.org/audio/poster/The_Stark_Palace_640x360.png"
    },
    {
      title:"Hidden",
      artist:"Miaow",
      free: true,
      mp3:"http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3",
      oga:"http://www.jplayer.org/audio/ogg/Miaow-02-Hidden.ogg",
      poster: "http://www.jplayer.org/audio/poster/Miaow_640x360.png"
    }
  ];
  var options = {
    playlistOptions: {
      autoPlay: false,
      enableRemoveControls: true
    },
    ready: function(event) {
      $('#mp_title').text(playlist[0].title);
      $('#mp_artist').text(playlist[0].artist);
    },
    /*timeupdate: function(event) {
			my_extraPlayInfo.text(parseInt(event.jPlayer.status.currentPercentAbsolute, 10) + "%");
		},*/
		play: function(event) {
      $('#mp_title').text(event.jPlayer.status.media.title);
      $('#mp_artist').text(event.jPlayer.status.media.artist);
		},
    loadstart: function(event) {
      $('.loading').show();
		},
    loadeddata: function(event) {
      $('.loading').hide();
		},
    seeking: function(event) {
      $('.loading').show();
		},
    seeked: function(event) {
      $('.loading').hide();
		},
    swfPath: "/lib/jquery",
    //swfPath: "http://www.jplayer.org/latest/js/Jplayer.swf",
    supplied: "ogv, m4v, oga, mp3",
    size: {
      width: '60px',
      height: '40px'
    }
  };
  myPlaylist = new jPlayerPlaylist(cssSelector, playlist, options);
  
});
