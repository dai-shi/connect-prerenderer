/* exported TestController */

function TestController($scope, $http) {
  if (!document.body.getAttribute('data-prerendered')) {
    $http.get('/data.json').success(function(data) {
      $scope.data = data;
    });
  }
}
TestController.$inject = ['$scope', '$http'];
