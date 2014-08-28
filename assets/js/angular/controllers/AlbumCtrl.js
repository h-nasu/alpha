
appCtrl.controller('AlbumCtrl', function($scope, GetUser) {
  $scope.artist_id;
  GetUser.load();
  socket.get('/album', {artist: $scope.artist_id}, function(albums){
    if (albums.errors) {
      console.log(albums);
    } else {
      $scope.albums = albums;
      $scope.$apply();
    }
  });
});

