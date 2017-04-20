const angular = require('angular');
const MapboxClient = require('mapbox');

angular.module("govApi", []).factory( 'initialData', () => {
  const key = '0sbcnz7cfHXoyxxiB83hZOHf53MFkrgegwe5DV7h';

  return [
    { name: "Solar",
      url: "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=" + key,
      options: [
        { label: "Average Direct Normal Irradiance", key: "avg_dni"},
        { label: "Average Global Horizontal Irradiance", key: "avg_ghi"}
    ]
   }
  ];
})
.service('fetchData', ['$http', function($http) {
  this.get = function(location, url) {
    let data;

    const client = new MapboxClient('YOUR_ACCESS_TOKEN');
    client.geocodeForward(location, function(err, res) {
      // res is the geocoding result as parsed JSON
      return res;
    }).then(results => {
      debugger
      let latLng = `&lat=${results.lat}&lon=${results.long}`;
      data = $http.get(url+latLng);
    });

  };
}]);
