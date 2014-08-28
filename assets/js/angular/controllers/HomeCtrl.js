
appCtrl.controller('HomeCtrl', function($scope, $rootScope, GetUser) {
  GetUser.load();
});
