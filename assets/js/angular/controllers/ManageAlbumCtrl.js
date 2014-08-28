
appCtrl.controller('ManageAlbumCtrl', function($scope, $rootScope, $routeParams, $modal, GetUser) {
  $scope.artistId = $routeParams.artistId;
  
  GetUser.load();
  $scope.alertType = 'success';
  $scope.alertMsg = 'Modified with Success';
  $scope.showAlert = false;
  $scope.addAlbum = false;
  
  // alert result
  $scope.$on('msg',function(event, val){
    $scope.showAlert = true;
    $scope.alertMsg = val.name + ' is Updated!';
    $scope.addAlbum = false;
    getAlbums();
  });
  
  // get album list
  var getAlbums = function(){
    socket.get('/album', {artist:$scope.artistId}, function(res){
      if (res.errors) {
        //alert("An error occurred");
        console.log(res);
      } else {
        $scope.albums = res;
        $scope.$apply();
      }
    });
  };
  var waitLoadMe = setInterval(function(){
    if ($rootScope.me) {
      clearInterval(waitLoadMe);
      getAlbums();
    }
  });
  
  // delete album
  $scope.deleteAlbum = function(album) {
    var res = confirm('Are sure to remove '+album.name+'?');
    if (res) {
      socket.delete('/album/'+album.id, function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          getAlbums();
        }
      });
    }
  }
  
  $scope.openUploadImage = function (album) {
    $scope.openAlbum = album;
    var albumUploadInstance = $modal.open({
      templateUrl: '/partials/manageAlbumImageUpload.tpl.html',
      controller: 'ManageAlbumImageUploadCtrl',
      resolve: {
        album: function(){
          return album;
        }
      }
    })
  };
  
});

appCtrl.controller('ManageAlbumImageUploadCtrl', function($scope, $modalInstance, album) {
  $scope.album = album;
  $scope.close = function() {
    $modalInstance.dismiss('close');
  };
});

appCtrl.controller('ManageAlbumFormCtrl', function($scope) {
  $scope.albumId;
  $scope.artist_id;
  $scope.newAlbum = {};
  $scope.editLabel = false;
    
  // get album information
  if ($scope.albumId) {
    socket.get('/album/'+$scope.albumId, function(res){
      if (res.errors) {
        alert("An error occurred");
        console.log(res);
      } else {
        $scope.newAlbum = res;
        $scope.editLabel = true;
      }
    });
  }
  
  // submit form
  $scope.submit = function(newAlbum) {
    if ($scope.albumForm.$valid) {
      if (!newAlbum.artist_id) {
        newAlbum.artist = $scope.artist_id;
      }
      var cb = function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          if (newAlbum.id) {
            $scope.$parent.$parent.album = res;
          }
          $scope.$parent.$parent.editAlbum = false;
          $scope.$emit('msg',newAlbum);
          $scope.$apply();
        }
      };
      if ($scope.albumId) {
        socket.put('/album/'+$scope.albumId, newAlbum, cb);
      } else {
        socket.post('/album', newAlbum, cb);
      }
      
      
    }
  };
});


