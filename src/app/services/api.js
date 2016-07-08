angular.module('werethey').factory('api', ['$http', '$q', function ($http, $q) {

  const checkListings = (name) => {
    const deferred = $q.defer();

    $http.post('/api/check/', { name })
      .success(data => deferred.resolve(data))
      .error(err => {
        console.log('Error fetching from: ' + url);
        deferred.reject(err);
      });

    return deferred.promise;
  }

  return {
    checkListings
  };
}]);