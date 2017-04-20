const angular = require('angular');

angular.module('govApi',[])
  .controller('mainCtrl', ['$scope', ($scope) => {
    $scope.options = {width: 500, height: 300};
    $scope.data = [];
  }])
  .controller('updateForm', ['$scope', 'initialData', ($scope, initialData) => { //this will have a dependency on a service to fetch data
    $scope.apis = initialData;
    $scope.selectedApi = null;
    $scope.apiData = null;
    // $scope.update = (d, i) => $scope.data = dependencyHere with another service/function to parse data
  }]); // a directive will depend on this guy
