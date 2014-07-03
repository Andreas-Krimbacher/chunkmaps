angular.module('starter.controllers', ['leaflet-directive'])

.controller('DashCtrl', function($scope) {
})

.controller('FavoritesCtrl', function($scope, Favorites) {
  $scope.favorites = Favorites.all();
})

.controller('FavoriteDetailCtrl', function($scope, $stateParams, Favorites) {
  $scope.favorite = Favorites.get($stateParams.favoriteId);
})

.controller('SettingsCtrl', function($scope) {
});
