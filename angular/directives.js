
angular.module('govApi')
  .directive('d3Chart', () => {
    let lineChart = d3.custom.linePlot();
    let scatterChart = d3.custom.scatterPlot();
    let globeChart = d3.custom.globe();

    return {
      restrict: 'E',
      replace: true,
      template: '<div class="chart"></div>',

      link: (scope, element, attrs) => {

        var chartEl = d3.select(element[0]);
        // set up custom event to pass event/data from svg to scope
        scatterChart.on('customHover', function(d) {
          scope.hovered(d);
        });

        globeChart.on('customHover', function(d) {
          scope.hovered(d);
        });

        scatterChart.on('customClick', function(d) {
          scope.clicked(d);
        });

        // when switching between APIs remove previous svg
        scope.$watch('selectedApi', (newVals, oldVals) => {
          scope.loading = "";
          scope.data = [];
          while(element[0].firstChild) {
            element[0].firstChild.remove();
          }
        });

        scope.$watch('coords', (newVals) => {
          if (newVals) {
            globeChart.zoomClick(newVals);
          }
        });

        scope.$watch('data', (newVals, oldVals) => {

          if(scope.selectedApi && scope.data.length > 0) {
            if(scope.selectedApi.name === "Solar") {
              lineChart.title(scope.selectedApi.label);
              chartEl.datum(newVals).call(lineChart);
            } else if (scope.selectedApi.name === "Weather") {
              scatterChart.title(scope.selectedApi.label);
              chartEl.datum(newVals).call(scatterChart);
              chartEl.datum(newVals).call(globeChart);
            }
          } else if (!newVals.length && scope.dataAll.length) {
            alert("No data matches the criteria");
          }
        }, true);
      }
    };

  })
  .directive('baseDir', ($compile) => {

    const linker = function(scope, element, attrs) {
      scope.$watch('selectedApi', (newVal, oldVal) => {
        if (newVal === oldVal) return;
        if(oldVal) {
          element.removeAttr(`dir-${oldVal.name}`);
        }
        if(newVal) {
          element.attr(`dir-${newVal.name}`, true);
          $compile(element)(scope);
        }
      });
    };

    return {
      restrict: 'A',
      link: linker
    };
  })
  .directive('dirSolar', () => {
    return {
      restrict: 'A',
      replace: true,
      controller: 'solarForm',
      templateUrl: './angular/templates/irradiance.html'
    };
  })
  .directive('dirWeather', () => {
    return {
      restrict: 'A',
      replace: true,
      controller: 'weatherForm',
      templateUrl: './angular/templates/weather.html'
    };
  });
