

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

    $scope.input = "30";
    $scope.closed = true;
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
      $scope.data = [];
      $scope.loading = 'loading...';
      fetchWeather.get($scope.input, $scope.selectedApi.url, $scope.sources)
      .then(openResults => {
        if ($scope.closed) {
          $scope.loading = `Data loaded for open events...`;
          const newUrl = $scope.selectedApi.url + "status=closed&";
          fetchWeather.get($scope.input, newUrl, $scope.sources).then(closedResults => {
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
      $scope.data = [];

      let dataTemp = $scope.dataAll.map(event => {
        if ($scope.apiData === "All" || $scope.apiData === event.categories[0].title) {
          console.log(event);
          let source = !event.sources.length ?  "unknown" : event.sources[0].id;
          if (event.categories[0].title === "Temperature Extremes") {
            event.categories[0].title = "Temp Extremes";
          }
          return {
            type: event.categories[0].title,
            date: event.geometries[event.geometries.length - 1].date,
            source: source
          };
        }

      });

      dataTemp = dataTemp.filter( event => event !== undefined);
      $scope.data.push( ...dataTemp );
    };

    $scope.$watch('selectedApi.sources|filter:{selected:true}', function (newVals) {
      $scope.sources = newVals.map(function (source) {
        return source.id;
      });
    }, true);

  }]);
