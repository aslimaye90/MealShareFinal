angular.module('eatery').controller('indexCtrl', [ '$scope', function($scope){

    $scope.isLoggedIn = true;
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.userID = '';
    
    if(!localStorage.getItem('token')){
        $scope.isLoggedIn = false;
    }
    else{
        $scope.firstName = JSON.parse(localStorage.getItem('userDetails')).firstName;
        $scope.lastName = JSON.parse(localStorage.getItem('userDetails')).lastName;
        $scope.userID = JSON.parse(localStorage.getItem('userDetails'))._id;
    }
    
    $scope.logout = function(){
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        $scope.isLoggedIn = false;
        window.location.href = "/";
    };

}]);