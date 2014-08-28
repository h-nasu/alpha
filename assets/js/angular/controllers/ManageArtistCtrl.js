
appCtrl.controller('ManageArtistCtrl', function($scope, $rootScope, $modal, GetUser) {
  GetUser.load();
  $scope.alertType = 'success';
  $scope.alertMsg = 'Modified with Success';
  $scope.showAlert = false;
  $scope.addArtist = false;
  
  // alert result
  $scope.$on('msg',function(event, val){
    $scope.showAlert = true;
    $scope.alertMsg = val.name + ' is Updated!';
    $scope.addArtist = false;
    getArtists();
  });
  
  // get artist list
  var getArtists = function(){
    socket.get('/artist', {user:$rootScope.me.id}, function(res){
      if (res.errors) {
        //alert("An error occurred");
        console.log(res);
      } else {
        $scope.artists = res;
        $scope.$apply();
      }
    });
  };
  var waitLoadMe = setInterval(function(){
    if ($rootScope.me) {
      clearInterval(waitLoadMe);
      getArtists();
    }
  });
  
  // delete artist
  $scope.deleteArtist = function(artist) {
    var res = confirm('Are sure to remove '+artist.name+'?');
    if (res) {
      socket.delete('/artist/'+artist.id, function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          getArtists();
        }
      });
    }
  }
  
  $scope.openUploadImage = function (artist) {
    $scope.openArtist = artist;
    var artistUploadInstance = $modal.open({
      templateUrl: '/partials/manageArtistImageUpload.tpl.html',
      controller: 'ManageArtistImageUploadCtrl',
      resolve: {
        artist: function(){
          return artist;
        }
      }
    })
  };
  
});

appCtrl.controller('ManageArtistImageUploadCtrl', function($scope, $modalInstance, artist) {
  $scope.artist = artist;
  $scope.close = function() {
    $modalInstance.dismiss('close');
  };
});

appCtrl.controller('ManageArtistFormCtrl', function($scope) {
  $scope.artistId;
  $scope.newArtist = {};
  $scope.editLabel = false;
    
  // get artist information
  if ($scope.artistId) {
    socket.get('/artist/'+$scope.artistId, function(res){
      if (res.errors) {
        alert("An error occurred");
        console.log(res);
      } else {
        $scope.newArtist = res;
        $scope.editLabel = true;
      }
    });
  }
  
  // submit form
  $scope.submit = function(newArtist) {
    if ($scope.artistForm.$valid) {
      var cb = function(res){
        if (res.errors) {
          alert("An error occurred");
          console.log(res);
        } else {
          if (newArtist.id) {
            $scope.$parent.$parent.artist = res;
          }
          $scope.$parent.$parent.editArtist = false;
          $scope.$emit('msg',newArtist);
          $scope.$apply();
        }
      };
      if ($scope.artistId) {
        socket.put('/artist/'+$scope.artistId, newArtist, cb);
      } else {
        socket.post('/artist', newArtist, cb);
      }
      
      
    }
  };
});