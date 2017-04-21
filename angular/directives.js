
angular.module('govApi')
  .directive('d3Chart', () => {
    let chart = d3.custom.barChart();


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
  .directive('apiForm', () => {
    return {
      restrict: 'E',
      replace: true,
      controller: 'updateForm',
      templateUrl: './angular/templates/irradiance.html'
    };
  });
