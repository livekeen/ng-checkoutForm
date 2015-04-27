// angular.module('checkoutApp', [])
//   .controller('CheckoutController', ['$scope', function($scope) {
//     $scope.master = {};

//     $scope.update = function(user) {
//       $scope.master = angular.copy(user);
//     };

//     $scope.reset = function() {
//       $scope.user = angular.copy($scope.master);
//     };

//     $scope.reset();
//   }]);

(function() {
  // Create angular app
  var app = angular.module('checkoutApp', []);

  // Create controller
  app.controller("CheckoutController", function(){

    this.checkout = {};

    this.submitCheckout = function(product){
      product.checkout.push(this.checkout);
      this.checkout = {};
    };
  });

  var skus = [{
    name: 'Funky Socks',
    price: '99.99',
    frequency: 'monthly'
  },{
    name: 'Weird Socks',
    price: '99.99',
    frequency: 'yearly'
  }];
})();

// angular.module('checkoutApp').config(function($window) {
//     $window.Stripe.setPublishableKey('pk_test_jzHurXHqR8OD25e2kfHvpETD');
// });