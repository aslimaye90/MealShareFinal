angular.module('eatery').controller('editProfileCtrl', [ '$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    
    $scope.data = '';
    
    $scope.getData = function(){
        $http.get('/api/persons/' + $routeParams.PId)
        .then(
            function(data){
                data.data.dateOfBirth = new Date(data.data.dateOfBirth);
                $scope.data = data.data;
            },
            function(errData){
                alert(JSON.stringify(errData.data));
            }
        );    
    };
    
    $scope.getData();
    
    
    $scope.update = function(){
        $http.put('/api/persons/'+$scope.data._id, $scope.data)
        .then(
            function(data){
                $scope.getData();
            },
            function(errData){
                alert(JSON.stringify(errData.data));
                $scope.getData();
            }
        );
    };
    
}]);