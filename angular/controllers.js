

angular.module('govApi')
  .controller('mainCtrl', ['$scope', 'initialData', function($scope, initialData) {
    $scope.options = {width: 500, height: 300};
    $scope.data = [];
    $scope.apis = initialData;
    $scope.selectedApi = null;

    $scope.changeValue = function(api) {
      $scope.selectedApi = api;
    };
  }])
  .controller('solarForm', ['$scope',  'fetchSolar', ($scope, fetchSolar) => {
    $scope.apiData = null;
    $scope.input = "Boulder, CO";

    $scope.clearPlot = function() {
      $scope.data = [];
    };


    $scope.update = function() {
      $scope.loading = 'loading...';
      fetchSolar.get($scope.input, $scope.selectedApi.url).then(res => {
        $scope.loading = `Data loaded for ${$scope.input}`;
        $scope.dataAll = res.data.outputs;
      });
    };

    $scope.plot = function() {
      const dataTemp = $scope.dataAll[$scope.apiData];
      const dataArray = Object.keys(dataTemp.monthly).map( key => {
        return dataTemp.monthly[key];
      });
      $scope.data.push( {id: $scope.input, values: dataArray});
    };

  }])
  .controller('weatherForm', ['$scope', 'fetchWeather', ($scope, fetchWeather) => {

    $scope.input = "7";
    $scope.closed = false;
    $scope.sources = [];
    $scope.sourcesDetail = "Show Sources";
    $scope.hideSources = true;
    $scope.apiData = 'All';

    $scope.toggleSources = function() {
      if ($scope.hideSources) {
        $scope.hideSources = false;
        $scope.sourcesDetail = "Hide Sources";
      } else {
        $scope.hideSources = true;
        $scope.sourcesDetail = "Show Sources";
      }
    };

    $scope.update = function() {
      $scope.loading = 'loading...';
      fetchWeather.get($scope.input, $scope.selectedApi.url, $scope.sources)
      .then(openResults => {
        if ($scope.closed) {
          $scope.loading = `Data loaded for open events...`;
          debugger
          const newUrl = $scope.selectedApi.url + "status=closed&";
          fetchWeather.get($scope.input, newUrl, $scope.sources).then(closedResults => {
            debugger
            $scope.loading = `Data loaded open and closed events for the last ${$scope.input} days`;
            $scope.dataAll = openResults.concat(closedResults);
          });
        } else {
          $scope.loading = `Data loaded for open events for the last ${$scope.input} days`;
          $scope.dataAll = openResults;
        }
      });
    };

    $scope.plot = function() {

      let dataTemp = $scope.dataAll.map(event => {
        if ($scope.apiData === "All" || $scope.apiData === event.categories[0].title) {
          return {
            type: event.categories[0].title,
            date: event.geometries[0].date,
            source: event.sources[0].id
          };
        }

      });

      debugger
      $scope.data.push( ...dataTemp );
    };

    $scope.$watch('selectedApi.sources|filter:{selected:true}', function (newVals) {
      $scope.sources = newVals.map(function (source) {
        return source.id;
      });
    }, true);

  }]);
