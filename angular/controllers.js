

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
        if ($scope.selectedApi.name === "Solar") {
          $scope.dataAll = res.data.outputs;
        }
      });
    };

    $scope.plot = function() {
      const dataTemp = $scope.dataAll[$scope.apiData];
      const dataArray = Object.keys(dataTemp.monthly).map( key => {
        return dataTemp.monthly[key];
      });
      $scope.data = dataArray;
    };

  }]);
