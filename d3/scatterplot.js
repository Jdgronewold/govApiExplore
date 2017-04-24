
d3.custom.scatterPlot = function module() {
  var margin = {top: 20, right: 80, bottom: 40, left: 100},
      width = 700,
      height = 600,
      gap = 0,
      ease = d3.easeLinear,
      title,
      finalDates;
  var svg, duration = 500;

  var dispatch = d3.dispatch('customHover');
  function exports(_selection) {
      _selection.each(function(_data) {
        console.log(_data);

          var chartW = width - margin.left - margin.right,
              chartH = height - margin.top - margin.bottom;
          var dates = d3.extent(_data, (d) => new Date(d.date))
          console.log(dates);
          let firstDate = new Date(dates[0]);
          firstDate = new Date(firstDate.setDate(firstDate.getDate() -1));
          finalDates = [firstDate, dates[1]];
          console.log(finalDates);

          var x1 = d3.scaleTime()
              .domain(finalDates)
              .range([0, chartW]);
          var y1 = d3.scalePoint()
            .domain([
                "", "Drought", "Dust and Haze", "Earthquakes",
                "Floods", "Landslides", "Manmade", "Sea and Lake Ice",
                "Severe Storms", "Snow", "Temp Extremes", "Volcanoes",
                "Water Color", "Wildfires",
              ])
            .range([chartH, 0]);
          var color = d3.scaleOrdinal(d3.schemeCategory10);

          if(!svg) {
              svg = d3.select(this)
                  .append('svg')
                  .classed('chart', true);
              var container = svg.append('g').classed('container-group', true);
              container.append('g').classed('chart-group', true);
              container.append('g').classed('x-axis-group axis', true);
              container.append('g').classed('y-axis-group axis', true);
          }
          if(!_data.length) {
            svg.selectAll('.event').transition().style('opacity', 0).remove();
          }

          svg.transition().duration(duration)
              .attr('width', width)
              .attr('height', height);

          svg.select('.container-group')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          svg.select('.x-axis-group.axis')
              .attr('transform', 'translate(0,' + (chartH) + ')');

          svg.select('.x-axis-group.axis')
              .transition()
              .duration(duration)
              .ease(ease)
              .call(d3.axisBottom(x1)
                    .tickFormat(d3.timeFormat("%e %b")))
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.9em")
              .attr("dy", "-.3em")
              .attr("transform", "rotate(-65)");

          svg.select('.y-axis-group.axis')
              .transition()
              .duration(duration)
              .ease(ease)
              .call(d3.axisLeft(y1));

          svg.select('.y-axis-group.axis')
              .append("text")
              .attr("transform", "rotate(90)")
              .attr('x', 56)
              .attr("y", -5)
              // .attr("dy", "5em")
              .attr("fill", "#000")
              .style("text-anchor", "end")
              .style('font-size', 14)
              .text(title);

          let events = svg.select('.container-group')
            .selectAll(".event")
            .data(_data);

          events.enter()
            .append("circle")
            .attr('class', 'event')
            .attr("r", 3.5)
            .attr('cx', function(d) {
              return x1(new Date(d.date)); })
            .attr('cy', function(d) { return y1(d.type); })
            .style('fill', function(d) { return color(d.type); });

          events.transition()
            .ease(ease)
            .attr("r", 3.5)
            .attr('cx', function(d) {
              return x1(new Date(d.date)); })
            .attr('cy', function(d) { return y1(d.type); })
            .style('fill', function(d) { return color(d.type); });

            events.exit()
            .transition()
            .style("opacity", 0)
            .remove();

          // events.append("text")
          //   .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
          //   .attr("transform", function(d, i) { return "translate(" + x1(11) + "," + y1(d.value) + ")"; })
          //   .attr("x", 3)
          //   .attr("dy", "0.35em")
          //   .style("font", "10px sans-serif")
          //   .text(function(d) { return d.id; });

      });
  }
  exports.title = function(_x) {
      if (!arguments.length) return title;
      title = _x;
      return this;
  };
  exports.finalDates = function(_x) {
      if (!arguments.length) return finalDates;
      finalDates = _x;
      return this;
  };
  exports.ease = function(_x) {
      if (!arguments.length) return ease;
      ease = _x;
      return this;
  };
  return exports;
};
