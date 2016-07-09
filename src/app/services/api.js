angular.module('werethey').factory('api', ['$http', '$q', function ($http, $q) {

  var checkListings = (name) => {
    var deferred = $q.defer();

    $http.post('/api/check/', { name })
      .success(data => deferred.resolve(data))
      .error(err => {
        console.log('Error fetching from: ' + url);
        deferred.reject(err);
      });

    return deferred.promise;
  }

  var getLink = (name, year) => {
    var deferred = $q.defer();

    $http.post('/api/link/', { name, year })
      .success(data => deferred.resolve(data))
      .error(err => {
        console.log('Error fetching from: ' + url);
        deferred.reject(err);
      });

    return deferred.promise;
  }

  return {
    checkListings,
    getLink
  };
}]);