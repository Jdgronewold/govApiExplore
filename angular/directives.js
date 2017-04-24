
angular.module('govApi')
  .directive('d3Chart', () => {
    let lineChart = d3.custom.linePlot();
    let scatterChart = d3.custom.scatterPlot();
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="chart"></div>',

      link: (scope, element, attrs) => {
        var chartEl = d3.select(element[0]);

        scope.$watch('data', (newVals, oldVals) => {
          // can put a switch statement here to call different
          // charts based on scope.selectedApi.name
          if(scope.selectedApi) {
            if(scope.selectedApi.name === "Solar") {
              lineChart.title(scope.selectedApi.label);
              chartEl.datum(newVals).call(lineChart);
            } else if (scope.selectedApi.name === "Weather") {
              scatterChart.title(scope.selectedApi.label);
              chartEl.datum(newVals).call(scatterChart);
            }  
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
