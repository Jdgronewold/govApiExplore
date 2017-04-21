

angular.module('govApi')
  .controller('mainCtrl', ['$scope', function($scope) {
    $scope.options = {width: 500, height: 300};
    $scope.data = [];
  }])
  .controller('updateForm', ['$scope', 'initialData', 'fetchData', ($scope, initialData, fetchData) => {
    $scope.apis = initialData;
    $scope.selectedApi = null;
    $scope.apiData = null;
    $scope.input = "Boulder, CO";

    $scope.changeValue = function(api) {
      $scope.selectedApi = api;
    };

    $scope.update = function() {
      fetchData.get($scope.input, $scope.selectedApi.url).then(res => {
        debugger
        $scope.data = res;
      });
    };

    // $scope.update = (d, i) => $scope.data = dependencyHere with another service/function to parse data
  }]); // a directive will depend on this guy
