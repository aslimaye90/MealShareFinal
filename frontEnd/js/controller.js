/**
 * Created by Karuna on 10/28/2015.
 */
'use strict';

angular.module('eatery').controller('storeController', [ '$scope', '$http', function($scope, $http){

    $scope.latitude = parseFloat('37.2970155');
    $scope.longitude = parseFloat('-121.8174129');
    $scope.meals = '';
    $scope.search = '';
    
    $scope.$watch('search', function(newV, v2){
        searchDB();
    });
    
    function searchDB(){
        $http.get('/api/search/'+$scope.search)
        .then(
            function(data) {
                $scope.meals = data.data;
            },
            function(errData) {
                getMeals();
            }
        );
    }
    
    $scope.getVisibility = function(index){
        if(index > $scope.meals.length-1)
            return 'hidden';
        return 'visible';
    }
    
    function getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(pos){
                $scope.latitude = pos.coords.latitude;
                $scope.longitude = pos.coords.longitude;
                getMeals();
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            getMeals();
        }
    }
    
    getMeals();
    getLocation();
    
    
    //get meals from server
    function getMeals(){
        var url = '/api/meals';
        if($scope.longitude && $scope.latitude){
            url+='?longitude='+ $scope.longitude.toString() + "&latitude=" + $scope.latitude.toString();
        }
        
        $http.get(url)
        .then(
            function(data){
                $scope.meals = data.data;
            },
            function(errData){
                console.log('error: ' + JSON.stringify(errData));
            }
        );    
    }
    
    function rad(x) {
        return x * Math.PI / 180;
    };
    
    // data sent as longitude,latitude
    $scope.getDistance = function(alat, along, blat, blong) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(alat - blat);
        var dLong = rad(along - blong);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(alat)) * Math.cos(rad(blat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d/1000/1.6; // returns the distance in meter
    };

}]);