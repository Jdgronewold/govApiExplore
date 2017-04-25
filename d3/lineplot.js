d3.custom = {};

d3.custom.linePlot = function module() {
    var margin = {top: 20, right: 80, bottom: 40, left: 50},
        width = 600,
        height = 500,
        gap = 0,
        ease = d3.easeLinear,
        title;
    var svg, duration = 500;

    var dispatch = d3.dispatch('customHover');
    function exports(_selection) {
        _selection.each(function(_data) {

            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var x1 = d3.scaleLinear()
                .domain([0, 11])
                .range([0, chartW]);

            var array = d3.range(0, (chartW + margin.left), ((chartW  + margin.left)/12));

            var x2 = d3.scaleOrdinal()
              .domain([
                "January", "Feb", "Mar", "Apr", "May", "June", "July",
                "Aug", "Sept", "Oct", "Nov", "Dec"
              ])
              .range(array);

            var y1 = d3.scaleLinear()
                .domain([0, d3.max(_data, (data, i) => { return d3.max(data.values, (d) => d ); })])
                .range([chartH, 0]);

            var ord = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(_data.map( d => d.id));

            var line = d3.line()
                .x(function(d, i) { return x1(i); })
                .y(function(d) { return y1(d); });

            if(!svg || d3.select('.svgChart').empty()) {
                svg = d3.select(this)
                    .append('svg')
                    .classed('svgChart', true);
                var container = svg.append('g').classed('container-group', true);
                container.append('g').classed('chart-group', true);
                container.append('g').classed('x-axis-group axis', true);
                container.append('g').classed('y-axis-group axis', true);
            }
            if(!_data.length) {
              svg.selectAll('.location').transition().style('opacity', 0).remove();
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
                .call(d3.axisBottom(x2).ticks(12));

            svg.select('.y-axis-group.axis')
                .transition()
                .duration(duration)
                .ease(ease)
                .call(d3.axisLeft(y1));

            svg.select('.y-axis-group.axis')
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr('x', -150)
                .attr("y", -50)
                .attr("dy", "1.2em")
                .attr("fill", "#000")
                .style('font-size', 14)
                .text(title);

            let locations = svg.select('.container-group')
              .selectAll(".location")
              .data(_data)
              .enter().append('g')
              .attr('class', 'location');

            locations.append("path")
              .attr('class', 'line')
              .attr('d', function(d) { return line(d.values); })
              .style('stroke', function(d) { return ord(d.id); })
              .style('fill', 'none')
              .style('stroke-width', 3)
              .exit()
              .transition()
              .style("opacity", 0);

            locations.append("text")
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d, i) { return "translate(" + x1(11) + "," + y1(d.value) + ")"; })
              .attr("x", 3)
              .attr("dy", "0.35em")
              .style("font", "10px sans-serif")
              .text(function(d) { return d.id; });

        });
    }
    exports.title = function(_x) {
        if (!arguments.length) return title;
        title = _x;
        return this;
    };
    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        duration = 0;
        return this;
    };
    exports.ease = function(_x) {
        if (!arguments.length) return ease;
        ease = _x;
        return this;
    };
    return exports;
};
