
appCtrl.controller('ManageSongCtrl', function($scope, $rootScope, $routeParams, $modal, GetUser) {
  $scope.albumId = $routeParams.albumId;
  
  GetUser.load();
  $scope.alertType = 'success';
  $scope.alertMsg = 'Modified with Success';
  $scope.showAlert = false;
  $scope.addSong = false;
  
  // alert result
  $scope.$on('msg',function(event, val){
    $scope.showAlert = true;
    $scope.alertMsg = val.name + ' is Updated!';
    $scope.addSong = false;
    getSongs();
  });
  
  // get song list
  var getSongs = function(){
    socket.get('/song', {album:$scope.albumId}, function(res){
      if (res.errors) {
        //alert("An error occurred");
        console.log(res);
      } else {
        $scope.songs = res;
        $scope.$apply();
      }
    });
  };
  var waitLoadMe = setInterval(function(){
    if ($rootScope.me) {
      clearInterval(waitLoadMe);
      getSongs();
    }
  });
  
  // delete song
  $scope.deleteSong = function(song) {
    var res = confirm('Are sure to remove '+song.name+'?');
    if (res) {
      socket.delete('/song/'+song.id, function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          getSongs();
        }
      });
    }
  }
  
  $scope.openUploadImage = function (song) {
    $scope.openSong = song;
    var songUploadInstance = $modal.open({
      templateUrl: '/partials/manageSongUpload.tpl.html',
      controller: 'ManageSongUploadCtrl',
      resolve: {
        song: function(){
          return song;
        }
      }
    })
  };
  
});

appCtrl.controller('ManageSongUploadCtrl', function($scope, $modalInstance, song) {
  $scope.song = song;
  $scope.close = function() {
    $modalInstance.dismiss('close');
  };
});

appCtrl.controller('ManageSongFormCtrl', function($scope) {
  $scope.songId;
  $scope.album_id;
  $scope.newSong = {};
  $scope.editLabel = false;
    
  // get song information
  if ($scope.songId) {
    socket.get('/song/'+$scope.songId, function(res){
      if (res.errors) {
        alert("An error occurred");
        console.log(res);
      } else {
        $scope.newSong = res;
        $scope.editLabel = true;
      }
    });
  }
  
  // submit form
  $scope.submit = function(newSong) {
    if ($scope.songForm.$valid) {
      if (!newSong.album_id) {
        newSong.album = $scope.album_id;
      }
      var cb = function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          if (newSong.id) {
            $scope.$parent.$parent.song = res;
          }
          $scope.$parent.$parent.editSong = false;
          $scope.$emit('msg',newSong);
          $scope.$apply();
        }
      };
      if ($scope.songId) {
        socket.put('/song/'+$scope.songId, newSong, cb);
      } else {
        socket.post('/song', newSong, cb);
      }
      
      
    }
  };
});


