
angular.module('govApi')
  .directive('d3Chart', () => {
    let chart = d3.custom.scatterPlot();


    return {
      restrict: 'E',
      replace: true,
      template: '<div class="chart"></div>',

      link: (scope, element, attrs) => {
        var chartEl = d3.select(element[0]);

        scope.$watch('data', (newVals, oldVals) => {
          debugger
          console.log(scope);
          chartEl.datum(newVals).call(chart);
        }, true);
      }
    };

  })
  .directive('apiForm', () => {
    return {
      restrict: 'E',
      replace: true,
      controller: 'updateForm',
      templateUrl: './angular/templates/irradiance.html'
    };
  });
