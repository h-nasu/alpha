
appCtrl.controller('ArtistCtrl', function($scope, GetUser) {
  GetUser.load();
  socket.get('/artist', function(artists){
    if (artists.errors) {
      console.log(artists);
    } else {
      $scope.artists = artists;
      $scope.$apply();
    }
  });
  
});

appCtrl.controller('ArtistDetailCtrl', function($scope, $routeParams, GetUser) {
  $scope.artistId = $routeParams.artistId;
  GetUser.load();
  socket.get('/artist/'+$scope.artistId, function(artist){
    if (artist.errors) {
      console.log(artist);
    } else {
      $scope.artist = artist;
      $scope.$apply();
    }
  });
  
});
