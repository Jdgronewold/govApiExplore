

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
    location = location.replace(",", '%2C');
    location = location.replace(" ", '%20');
    const key = "pk.eyJ1IjoiamRncm9uZXdvbGQiLCJhIjoiY2oxcXFuMmQwMDBoMjMzczBid2Rrb2NrMCJ9.NCne1FYlo0EC38P8hhQBCg";

    let geoCodeUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      location + '.json?access_token=' + key + '&country=us&types=place';
    return $http.get(geoCodeUrl).then(results => {
      let latLng = `&lat=${results.data.features[0].center[1]}&lon=${results.data.features[0].center[0]}`;
      return $http.get(url+latLng);
    });
  };
}]);
