/* exported TestController */

function TestController($scope, $http) {
  $http.get('/data.json').success(function(data) {
    $scope.data = data;
  });
}
TestController.$inject = ['$scope', '$http'];
