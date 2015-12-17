angular.module('eatery').controller('donateCtrl', [ '$scope', '$http', function($scope, $http){
    
    $scope.data = '';
    
    function getFoodbanks(){
        $http.get('/api/foodbanks')
        .then(
            function(data){
                $scope.data = data.data;
            },
            function(errData){
                alert(JSON.stringify(errData.data));
            }
        );    
    }
    
    getFoodbanks();
    
}]);