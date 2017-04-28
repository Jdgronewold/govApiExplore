
// rotation and zoom based on https://bl.ocks.org/emeeks/af3c0114adfd9ead565e6c0f4a9c494e

d3.custom.globe = function module() {
  var margin = {top: 20, right: 80, bottom: 40, left: 100},
      width = 400,
      height = 400,
      scale= 250,
      ease = d3.easeLinear,
      degreeDifferenceX = 0,
      degreeDifferenceY = 0,
      clicked = false,
      title,
      finalDates;
  var svg, duration = 500;
  var rotate = [0,0];

  var colors = {
    "Drought": "#8c564b", "Dust and Haze": "#c49c94",
    "Earthquakes": "#2ca02c", "Floods": "#1f77b4",
    "Landslides": "#bcbd22", "Manmade": "#7f7f7f",
    "Sea and Lake Ice": "#e377c2", "Severe Storms": "#9467bd",
    "Snow": "#aec7e8", "Temp Extremes": "#17becf",
    "Volcanoes": "#ff7f0e",
    "Water Color": "#ffbb78", "Wildfires": "#d62728"
  };

  var dispatcher = d3.dispatch('customHover');

  var projection = d3.geoOrthographic()
      .scale(200)
      .translate([200,200])
      .center([0,0])
      .rotate([0,0]);

  var path = d3.geoPath()
      .projection(projection);

  var graticule = d3.geoGraticule();

  var rotateScale = d3.scaleLinear()
    .domain([-400, 0, 400])
    .range([-180, 0, 180]);

  var reverseRotate = d3.scaleLinear()
    .domain([-180, 0, 180])
    .range([-400, 0, 400]);

  var zoomSettings = d3.zoomIdentity
    .translate(0, 0)
    .scale(200)

  var zoomed = function() {
    var e = d3.event;
    var rotationBeforeX = projection.rotate()[0];

    if (clicked) {
      clicked = false;
    }

    var currentRotateX = (rotateScale(e.transform.x) + degreeDifferenceX) % 360;
    var currentRotateY = (rotateScale(e.transform.y) + degreeDifferenceY) % 360;

    var scaleBefore = projection.scale();

    if (scaleBefore === e.transform.k) {
        projection
          .rotate([currentRotateX, currentRotateY])
          .scale(e.transform.k);
    } else {
        projection
        .scale(e.transform.k);
    }

    d3.select(".graticule").attr("d", path);
    d3.select(".land").attr("d", path);
    d3.select("#sphere").attr("d", path);

    d3.selectAll(".mapCircle").attr("d", path.pointRadius(e.transform.k/50));


  };

  var zoom = d3.zoom().on("zoom", zoomed);

  function exports(_selection) {
      _selection.each(function(_data) {

          d3.selectAll(".graticule").remove();
          d3.selectAll(".land").remove();
          d3.selectAll("#sphere").remove();
          d3.selectAll(".mapCircle").remove();


          var chartW = width - margin.left - margin.right,
              chartH = height - margin.top - margin.bottom;


          if(!svg || d3.select('.svgGlobe').empty()) {
              svg = d3.select(this)
                  .append('svg')
                  .classed('svgGlobe', true)
          }

          svg.attr('width', width)
             .attr('height', height);

          d3.select(".svgGlobe").call(zoom).call(zoom.transform, zoomSettings);


          svg.append("defs").append("path")
              .datum({type: "Sphere"})
              .attr("id", "sphere")
              .attr("d", path);

          svg.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

          svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

          d3.json("countries_1e5.json", function(error, data) {
            svg.insert("path", ".graticule")
                .datum(topojson.feature(data, data.objects.countries))
                .attr("class", "land")
                .attr("d", path);
          });


          var circles = svg.append("g");

          circles.selectAll("path")
            .data(_data)
            .enter()
            .append("path")
            .attr("class", "mapCircle")
            .attr("fill", (d) => colors[d.type])
            .on("mouseover", (d) => {
              dispatcher.call("customHover", this, d.properties);
            })
            .on("mouseout",(d) => {
              const clearData = {name: "", description: ""};
              dispatcher.call("customHover", this, clearData);
            })
            .datum((d) => {
              if (d.coordType === "Polygon") {

                var testCoords = [
                  d3.mean(d.coords[0], (data) => data[0]),
                  d3.mean(d.coords[0], (data) => data[1])
                ];

                return {
                  type: "Point",
                  coordinates: testCoords,
                  properties: {name: d.name, description: d.description}
                };
              } else {
                return {
                  type: "Point",
                  coordinates: d.coords,
                  properties: {name: d.name, description: d.description}
                };
              }
            })
            .attr("d", path);



      });
  }
  exports.zoomClick = function(coords) {
    clicked = true;
    var currentX = projection.rotate()[0];
    var currentY = projection.rotate()[1];
    degreeDifferenceX += (-coords[0] - currentX);
    degreeDifferenceY += (-coords[1] - currentY);

    projection.rotate([-coords[0], -coords[1]]);

    d3.select(".land").attr("d", path);
    d3.select("#sphere").attr("d", path);
    d3.select(".graticule").attr("d", path);
    d3.selectAll(".mapCircle").attr("d", path);

    return this;
  };
  exports.on = function() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? exports : value;
  };
  return exports;

};
