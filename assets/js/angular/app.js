'use strict';

// angular.element($0).scope()

// Declare app level module which depends on filters, and services
angular.module('alpha', [
  'ngRoute',
  'alpha.filters',
  'alpha.services',
  'alpha.directives',
  'alpha.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/home', {templateUrl: '/partials/home.tpl.html', controller: 'HomeCtrl'});
  $routeProvider.when('/manageArtist', {templateUrl: '/partials/manageArtist.tpl.html', controller: 'ManageArtistCtrl'});
  $routeProvider.when('/manageAlbum/:artistId', {templateUrl: '/partials/manageAlbum.tpl.html', controller: 'ManageAlbumCtrl'});
  $routeProvider.when('/manageSong/:albumId', {templateUrl: '/partials/manageSong.tpl.html', controller: 'ManageSongCtrl'});
  $routeProvider.when('/artist', {templateUrl: '/partials/artist.tpl.html', controller: 'ArtistCtrl'});
  $routeProvider.when('/artistDetail/:artistId', {templateUrl: '/partials/artistDetail.tpl.html', controller: 'ArtistDetailCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
