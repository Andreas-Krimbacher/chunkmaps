angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Favorites', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var favorites = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return favorites;
    },
    get: function(favoritedId) {
      // Simple index lookup
      return favorites[favoritedId];
    }
  }
});
