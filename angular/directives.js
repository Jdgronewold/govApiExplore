const angular = require('angular');

angular.module('govApi',[])
  .directive('d3-chart', () => {
    let chart = d3.custom.scatterPlot();

    return {
      restrict: 'E',
      replace: true,
      template: '<div class="chart"></div>',
      scope: {
        data: '=data'
      },
      link: (scope, element, attrs) => {
        var chartEl = d3.select(element[0]);

        scope.$watch('data', (newVals, oldVals) => {
          chartEl.datum(newVals).call(chart);
        });

      }
    };

  })
  .directive('api-form', ['updateForm', (updateForm) => {
    return {
      restrict: 'E',
      replace: true,
      controller: updateForm,
      templateURL: './templates/irradiance.html'
    };
  }]);
