var app = angular.module("eatery",['ngRoute'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.
            when('/main',{
                templateUrl: 'main.html',
                controller:'MainCtrl'
            }).
            when('/howitworks',{
                templateUrl: 'howitworks.html',
                controller:'MainCtrl'
            }).
            when('/team',{
                templateUrl: 'team.html',
                controller:'MainCtrl'
            }).
            when('/profile/:userID',{
                templateUrl: 'publicProfile.html',
                controller: 'publicProfile'
            }).
            when('/store',{
                templateUrl: 'store.html',
                controller:'storeController'
            }).
            when('/donate',{
                templateUrl: 'donate.html',
                controller:'donateCtrl'
            }).
            when('/faq',{
                templateUrl: 'faq.html',
                controller:'MainCtrl'
            }).
            when('/sellmeals',{
                templateUrl: 'sellmeals.html',
                controller:'sellMealsCtrl'
            }).
            when('/meals/:mealID',{
                templateUrl: 'meal.html',
                controller: 'mealDetailCtrl'
            }).
            /*when('/cart',{
                templateUrl: 'shoppingCart.html',
                controller:'storeController'
            }).*/
            when('/contact',{
                templateUrl: 'contact.html',
               // controller:'ContactCtrl'
            }).
            when('/history',{
                templateUrl: 'orderhistory.html',
                controller:'orderHistoryCtrl'
            }).
            when('/editprofile/:PId',{
                templateUrl: 'editProfile.html',
                controller:'editProfileCtrl'
            }).
            when('/foodbank/:FBID',{
                templateUrl: 'foodbankDetail.html',
                controller:'foodbankDetailCtrl'
            }).
            otherwise({redirectTo:'/main'});

    }])


    .controller('loginCtrl',['$scope', '$http', function($scope, $http){
        $scope.email = '';
        $scope.password = '';
        $scope.checkbox = false;
        
        $scope.login = function(){
            if($scope.email && $scope.password){
                $http.post(
                    '/api/login',
                    {
                        "email": $scope.email,
                        "password": $scope.password
                    }
                    )
                    .then(
                        function(data){
                            console.log(JSON.stringify(data.data));
                            localStorage.setItem("token", data.data.token);
                            localStorage.setItem("userDetails", JSON.stringify(data.data.userDetails));
                            window.location.replace("/");
                        },
                        function(errData){
                            alert(JSON.stringify(errData.data));
                        }
                    );
            }
        };
        
        $scope.signup = function(){
            if($scope.checkbox && $scope.email && $scope.password && $scope.firstName && $scope.lastName){
                $http.post(
                    '/api/persons',
                    {
                        "email": $scope.email,
                        "password": $scope.password,
                        "firstName": $scope.firstName,
                        "lastName": $scope.lastName
                    }
                    )
                    .then(
                        function(data){
                            console.log(JSON.stringify(data.data));
                            $scope.login();
                        },
                        function(errData){
                            alert(JSON.stringify(errData.data));
                        }
                    );
            }
        };
    }])
    
    .controller('sellMealsCtrl',['$scope', '$http', '$window', function($scope, $http, $window){
        
        var google = $window.google;
        var autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('address'),             //input
            {'componentRestrictions': {'country': 'us'}}    //options
        );
        
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            $scope.mealAddress = place.formatted_address;
            $scope.latitude = place.geometry.location.lat();
            $scope.longitude = place.geometry.location.lng();
        });
        
        
        $scope.latitude = '';
        $scope.longitude = '';
        $scope.title = '';
    	$scope.description = '';
    	$scope.mealAddress = '';
    	$scope.price = '';
    	$scope.image = '';
    	$scope.availableSpots = '';
    	$scope.startDateTime = new Date();
    	$scope.endDateTime = new Date(new Date().getTime() + 2*60*60*1000);
    	
    	
    	//  food category info
    	$scope.isVegan = false;
    	$scope.isVegetarian = false;
    	$scope.isGlutenFree = false;
    	$scope.isToGo = false;
    	$scope.isEatHere = false;
    	
    	//  allergen info
    	$scope.isPeanut = false;
    	$scope.isTreenut = false;
    	$scope.isEgg = false;
    	$scope.isWheat = false;
    	$scope.isMilk = false;
    	$scope.isFish = false;
    	$scope.isSoy = false;
    	
    	$scope.postMeal = function(){
    	    var x = document.getElementById("inputMealImage");
    	    var token = localStorage.getItem("token");
    	    if(!token){
    	      alert('please login to continue');
    	      return;
    	    }
    	    if(!x || !$scope.title || !$scope.mealAddress || !$scope.price ||
    	       !$scope.availableSpots || !$scope.startDateTime ||
    	       !$scope.endDateTime){
    	        alert('insufficient data');
    	        return;
    	    }
    	    
    	    var form = new FormData();
            form.append("title", $scope.title);
            form.append("mealAddress", $scope.mealAddress);
            form.append("price", $scope.price);
            form.append("availableSpots", $scope.availableSpots);
            form.append("startDateTime", $scope.startDateTime);
            form.append("endDateTime", $scope.endDateTime);
            form.append("image", x.files[0]);
            
            form.append("description", $scope.description);
            form.append("isVegan", $scope.isVegan);
            form.append("isVegetarian", $scope.isVegetarian);
            form.append("isToGo", $scope.isToGo);
            form.append("isEatHere", $scope.isEatHere);
            form.append("isGlutenFree", $scope.isGlutenFree);
            
            form.append("isPeanut", $scope.isPeanut);
            form.append("isTreenut", $scope.isTreenut);
            form.append("isMilk", $scope.isMilk);
            form.append("isEgg", $scope.isEgg);
            form.append("isFish", $scope.isFish);
            form.append("isSoy", $scope.isSoy);
            form.append("isWheat", $scope.isWheat);
    	    
            var xhr = new XMLHttpRequest();
            xhr.onload = function(data) {
                window.location.reload();
            };
            
            if($scope.longitude && $scope.latitude)
                xhr.open("post", "/api/meals?longitude="+$scope.longitude+"&latitude="+$scope.latitude);
            else
                xhr.open("post", "/api/meals");
            xhr.setRequestHeader("bearer", token);
            xhr.send(form);
    	};

    }])

    .controller('MainCtrl',['$scope',function($scope){
        $scope.isCollapsed = false;

    }])

    .controller('ShowMealsCtrl',['$scope','$http',function($scope,$http){
        $http.get('showmeals.json').then(function(response){
            $scope.showmeals = response.data;
        });


    }])

    .controller('MealDetailCtrl',['$scope','$http',function($scope,$http){
        $http.get('mealdetail.json').then(function(response){
            $scope.mealdetail = response.data;
        });


    }]);



// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
app.factory("DataService", function () {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("eatery");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with PayPal, you have to create a merchant account with
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "bernardo.castilho-facilitator@gmail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with Google Wallet, you have to create a merchant account with
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "500640663394527");

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});