'use strict';

angular.module('werethey').controller('ctrl',
    ['$scope', 'api', function ($scope, api) {

        const checkListings = (name) => {
            api.checkListings(name).then(data => {
                $scope.hits = data;
            });
        };

        $scope.submit = () => {
            checkListings($scope.name);
        };
    }]
)
