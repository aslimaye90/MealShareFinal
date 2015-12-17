angular.module('eatery').controller('foodbankDetailCtrl', [ '$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
    
    $scope.foodbank = '';
    $scope.otherVisibility = 'block';
    $scope.receiptVisibility = 'none';
    $scope.glyphicons = {
        "true": '<span class="glyphicon glyphicon-ok" style="color:darkgreen"></span>',
        "false": '<span class="glyphicon glyphicon-remove" style="color:red"></span>'
    };
    
    $scope.sendMessage = function(){
        $('#myModal').modal('hide');
        $scope.otherVisibility = 'none';
        $scope.receiptVisibility = 'block';
    }
    
    function getFoodbank(){
        var url = 'api/foodbanks/' + $routeParams.FBID;
        $http.get(
            url
        ).then(
            function(data){
                $scope.foodbank = data.data;
                document.getElementById("tdIsCannedFood").innerHTML = $scope.glyphicons[data.data.acceptedItems.cannedFood];
                document.getElementById("tdIsFarmProduce").innerHTML = $scope.glyphicons[data.data.acceptedItems.farmProduce];
                document.getElementById("tdIsPreparedFood").innerHTML = $scope.glyphicons[data.data.acceptedItems.preparedFood];
                document.getElementById("tdIsGrocery").innerHTML = $scope.glyphicons[data.data.acceptedItems.grocery];
                document.getElementById("tdIsPickUpAvailable").innerHTML = $scope.glyphicons[data.data.isPickUpAvailable];
            },
            function(errData){
                console.log(JSON.stringify(errData));
            }
        );
    }
    
    getFoodbank();
    
}]);