'use strict';

angular.module('werethey').controller('ctrl',
    ['$scope', 'api', '$window', function ($scope, api, $window) {

        const checkListings = (name) => {
            api.checkListings(name).then(data => {
                if (Object.keys(data).length === 0) {
                    data['no results'] = [{name: ':('}];
                }
                $scope.hits = data;
            });
        };

        $scope.getLink = (name, date) => {
            api.getLink(name, date.substring(0, 4)).then(data => {
                $window.open('http://www.imdb.com/' + data.link, '_blank');
            });
        }

        $scope.submit = () => {
            checkListings($scope.name);
        };
    }]
)
