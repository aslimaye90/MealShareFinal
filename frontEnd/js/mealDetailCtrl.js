angular.module('eatery').controller('mealDetailCtrl', [ '$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
    
    $scope.meal = '';
    $scope.quantity = 1;
    $scope.otherVisibility = 'block';
    $scope.receiptVisibility = 'none';
    
    $scope.buyMeal = function(){
        var token = localStorage.getItem("token");
	    if(!token){
	      alert('please login to continue');
	      return;
	    }
        
        var config = {
            headers:  {
                'bearer': token
            }
        };
        
        $http.post('/api/meals/buyers/'+ $scope.meal._id, {"quantity":$scope.quantity}, config)
        .then(
            function(data){
                $('#myModal').modal('hide');
                $scope.otherVisibility = 'none';
                $scope.receiptVisibility = 'block';
                return;
            },
            function(errData){
                $('#myModal').modal('hide');
                alert(JSON.stringify(errData.data.err));
            }
        );
    }
    
    $scope.glyphicons = {
        "true": '<span class="glyphicon glyphicon-ok" style="color:darkgreen"></span>',
        "false": '<span class="glyphicon glyphicon-remove" style="color:red"></span>'
    };
    
    function getMeal(){
        var url = 'api/meals/' + $routeParams.mealID;
        $http.get(
            url
        ).then(
            function(data){
                $scope.meal = data.data;
                document.getElementById("tdIsVegan").innerHTML = $scope.glyphicons[data.data.isVegan];
                document.getElementById("tdIsVegetarian").innerHTML = $scope.glyphicons[data.data.isVegetarian];
                document.getElementById("tdIsGlutenFree").innerHTML = $scope.glyphicons[data.data.isGlutenFree];
                initialize();
            },
            function(errData){
                console.log(JSON.stringify(errData));
            }
        );
    }
    
    getMeal();
    
    
    
    //var myCenter = new google.maps.LatLng(51.508742,-0.120850);
    
    function initialize()
    {
        var myCenter = new google.maps.LatLng($scope.meal.location[1],$scope.meal.location[0]);
        var mapProp = {
            center:myCenter,
            zoom:15,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
        var marker=new google.maps.Marker({
            position:myCenter,
        });
        marker.setMap(map);
        var infowindow = new google.maps.InfoWindow({
            content: "<b>"+$scope.meal.title+"</b>" + '<br>Price: $' + $scope.meal.price
        });
        
        infowindow.open(map,marker);
    }
    /*function map(){
        google.maps.event.addDomListener(window, 'load', initialize);
    }*/
    
}]);