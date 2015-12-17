angular.module('eatery').controller('orderHistoryCtrl', [ '$scope', '$http', function($scope, $http){

    $scope.data = '';
    $scope.reviewText = 'Great food!';
    $scope.rating = 3;
    $scope.reviewModalTitle = '';
    $scope.postReviewForSeller = '';
    var token = localStorage.getItem('token');
    
    
    $scope.openModal = function(PId, fname, lname, mealTitle){
        $scope.postReviewForSeller = PId;
        $scope.reviewModalTitle = mealTitle + ' by ' + fname + ' '+ lname;
        $('#myModal1').modal('show');
    }
    
    $scope.submitReview = function(){
        if($scope.reviewText && $scope.rating && $scope.rating>0 && $scope.rating<6){
            $http.post(
                '/api/persons/reviews/' + $scope.postReviewForSeller,
                {review: $scope.reviewText, rating: $scope.rating},
                {headers: {bearer: token}}
            )
            .then(
                function(data){
                    $('#myModal1').modal('hide');
                },
                function(errData){
                    $('#myModal1').modal('hide');
                    alert(JSON.stringify(errData.data));
                }
            );
        }
    }
    
    //  jquery function to track changes in the star rating
    jQuery(function($){
    	$(function(){
            $('.starrr').on('starrr:change', function(e, value){
                $scope.rating = value;
            });
        });
	});
    
    $scope.cancelMeal = function(mealID){
        if(confirm('are you sure?')){
            $http.delete(
                '/api/meals/buyers/' + mealID,
                {headers: {bearer: localStorage.getItem('token')}}
            ).then(
                function(data){
                    location.reload();
                },
                function(errData){
                    alert(JSON.stringify(errData));
                    location.reload();
                }
            );
        }
        else{
            //do nothing
        }
    };
    
    var token = localStorage.getItem('token');
    $http.get('/api/orders/myorders', {headers: {bearer: token}})
    .then(
        function(data){
            $scope.data = data.data;
        },
        function(errData){
            console.log(JSON.stringify(errData));
        }
    );

}]);