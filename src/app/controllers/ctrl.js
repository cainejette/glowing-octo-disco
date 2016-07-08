'use strict';

angular.module('werethey').controller('ctrl',
    ['$scope', 'api', '$window', function ($scope, api, $window) {

        const checkListings = (name) => {
            api.checkListings(name).then(data => {
                if (Object.keys(data).length === 0) {
                    data['no results'] = [{name: ':('}];
                }
                $scope.hits = data;
                console.dir(data);
                Object.keys($scope.hits).forEach(guestStar => {
                    $scope.hits[guestStar].forEach(episode => {
                        var pic = episode.guest_stars.filter(x => x.name.indexOf(guestStar) >= 0)[0].profile_path;
                        console.log('pic: [' + pic + ']');
                        if (pic != null) {
                            episode.pic = 'https://image.tmdb.org/t/p/w45_and_h45_bestv2' + pic;
                        } 
                    });
                });
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
