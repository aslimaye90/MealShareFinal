angular.module('eatery').controller('publicProfile', [ '$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    
    $scope.data = '';
    $scope.range = function(count){
        if(count<0 && count%1!==0){
            count = parseInt(count);
            return new Array(5+count-1);
        }
        if(count%1 !== 0)
           count = parseInt(count); 
        if(count<0)
            return new Array(5+count);
        return new Array(count);
    };
    
    function getUser(){
        $http.get('/api/persons/' + $routeParams.userID)
        .then(
            function(data){
                $scope.data = JSON.parse(JSON.stringify(data.data));
            },
            function(errData){
                alert(errData);
            }
        );
    }
    
    getUser();
    
}]);