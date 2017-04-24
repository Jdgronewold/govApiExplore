

angular.module("govApi", []).factory( 'initialData', () => {
  const key = '0sbcnz7cfHXoyxxiB83hZOHf53MFkrgegwe5DV7h';

  return [
    {
      name: "Solar",
      url: "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=" + key,
      options: [
        { label: "Average Direct Normal Irradiance", key: "avg_dni"},
        { label: "Average Global Horizontal Irradiance", key: "avg_ghi"}
    ],
    label: "Sunlight, kWh/m2/day"
  },
  {
    name: "Weather",
    url: "https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?",
    eventTypes: [
      { type: "All" },
      { type: "Drought" },
      { type: "Dust and Haze" },
      { type: "Earthquakes" },
      { type: "Floods" },
      { type: "Landslides" },
      { type: "Manmade" },
      { type: "Sea and Lake Ice" },
      { type: "Severe Storms" },
      { type: "Snow" },
      { type: "Temperature Extremes" },
      { type: "Volcanoes" },
      { type: "Water Color" },
      { type: "Wildfires" },
    ],
    sources: [
      { title: "Earth Observatory", id: "EO", selected: true },
      { title: "InciWeb", id: "InciWeb", selected: true},
      { title: 'Australia Bureau of Meteorology', id: "AU_BOM", selected: false},
      { title: "Copernicus Emergency Management Service", id: "CEMS", selected: false},
      { title: "Global Disaster Alert and Coordination System", id: "GDACS", selected: false},
      { title: "GLobal IDEntifier Number (GLIDE)", id: "GLIDE", selected: false},
      { title: "International Charter on Space and Major Disasters", id: "IDC", selected: false},
      { title: "LANCE Rapid Response", id: "MRR", selected: false},
      { title: "NASA Earth Science and Remote Sensing Unit", id: "NASA_ESRS", selected: false},
      { title: "Smithsonian Institution Global Volcanism Program", id: "SIVolcano", selected: false},
      { title: "Smithsonian Institution Global Volcanism Program", id: "SIVolcano", selected: false},
      { title: "Smithsonian Institution Global Volcanism Program", id: "SIVolcano", selected: false},
      { title: "USGS Hazards Data Distribution System", id: "HDDS", selected: false},
    ],
    label: "Category"
  }
  ];
})
.service('fetchSolar', ['$http', function($http) {
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
}])
.service('fetchWeather', ['$http', function($http){

  this.get = function( numDays, url, sources, closed) {

    const sourceString = "sources=" + sources.join(",");
    const daysString = "&days=" + numDays;
    const finalUrl = url + sourceString + daysString;

    return $http.get(finalUrl).then(openRes => {
        return openRes.data.events;
    });
  };


}]);
