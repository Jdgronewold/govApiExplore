

d3.custom.globe = function module() {
  var margin = {top: 20, right: 80, bottom: 40, left: 100},
      width = 800,
      height = 400,
      scale= 250,
      ease = d3.easeLinear,
      title,
      finalDates;
  var svg, duration = 500;
  var rotate = [0,0];

  var projection = d3.geoOrthographic()
      .rotate(rotate);

  var path = d3.geoPath()
      .projection(projection);

  var graticule = d3.geoGraticule();

  var m0, o0;

  var zoom = d3.zoom()
      .on("zoom", zoomed);

  var zoomed = function() {
    debugger
    var transform = d3.event.transform;

    d3.select("#sphere").attr("transform", transform);
    d3.select(".land").attr("transform", transform);
    // d3.select("stroke").attr("transform", transform);

  };

  function exports(_selection) {
      _selection.each(function(_data) {

          var chartW = width - margin.left - margin.right,
              chartH = height - margin.top - margin.bottom;


          if(!svg || d3.select('.svgGlobe').empty()) {
              svg = d3.select(this)
                  .append('svg')
                  .classed('svgGlobe', true)
          }

          svg.attr('width', width)
             .attr('height', height);

          svg.call(zoom)
             .call(zoom.transform, d3.zoomIdentity
             .translate(width / 2, height / 2)
             .scale(1 << 12));

          svg.append("defs").append("path")
              .datum({type: "Sphere"})
              .attr("id", "sphere")
              .attr("d", path);

          svg.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

          d3.json("countries_1e5.json", function(error, data) {
            svg.insert("path", ".graticule")
                .datum(topojson.feature(data, data.objects.countries))
                .attr("class", "land")
                .attr("d", path);
          });


      });
  }
  return exports;

}
