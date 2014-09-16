App.QuoteController = Ember.ObjectController.extend({
    isLoading: true,
    chartContent: [],
    margin: "",
    width: "",
    height: "",
    parse: "",
    bisectDate: "",
    formatValue: "",
    formatCurrency: "",
    x: "",
    y: "",
    xAxis: "",
    yAxis: "",
    line: "",
    area: "",
    chart: "",
    updateChart: function() {
        var chart = this.chart;
        if (!chart) {
            return; //  bypass the init, render when DOM ready
        }
        var content = this.chartContent.toArray();
        var margin = this.margin;
        var width = this.width;
        var height = this.height;
        var parse = this.parse;
        var bisectDate = this.bisectDate;
        var formatValue = this.formatValue;
        var formatCurrency = this.formatCurrency;
        var x = this.x;
        var y = this.y;
        var xAxis = this.xAxis;
        var yAxis = this.yAxis;
        var line = this.line;
        var area = this.area;

        // Parse dates and numbers, and reverse them so latest date is on right
        content.reverse().forEach(function(d) {
            d.date = parse(d._data.Date);
            d.close = +d._data.Close;
        });
        // Scale the range of the data
        x.domain([content[0].date, content[content.length - 1].date]);
        // leave some margins for the domain range so data is not touching the x
        var yMin = (d3.min(content, function(d) {
            return d.close;
        }) * 0.99);
        var yMax = (d3.max(content, function(d) {
            return d.close;
        }) * 1.01);
        y.domain([yMin, yMax]);
        // Update x-axis
        chart.select(".x.axis")
                .transition()
                .call(xAxis);
        // Update y-axis
        chart.select(".y.axis")
                .transition()
                .call(yAxis);
        // Update line graph
        chart.selectAll("path.line")
                .data(content)
                .transition()
                .attr("d", line(content));
        // Update area graph
        chart.selectAll("path.area")
                .data(content)
                .transition()
                .attr("d", area(content));
        // Update overlay
        chart.select(".overlay")
                .on("mousemove", mousemove);
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(content, x0, 1),
                    d0 = content[i - 1],
                    d1 = content[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            chart.select(".focus").attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
            chart.select(".focus").select("text").text(formatCurrency(d.close));
        }
    }.observes("chartContent"),
    actions: {
        render: function(elementId) {
            var content = this.chartContent.toArray();
            // Set the dimensions of the canvas / graph
            var margin = {top: 20, right: 30, bottom: 25, left: 50};
            var width = 770 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;
            // Parse the date / time
            var parse = d3.time.format("%Y-%m-%d").parse;
            var bisectDate = d3.bisector(function(d) {
                return d.date;
            }).left;
            // Format $$ Bill ya
            var formatValue = d3.format(",.2f");
            var formatCurrency = function(d) {
                return "$" + formatValue(d);
            };
            // Set the ranges
            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);
            // Define the axes
            var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
            var yAxis = d3.svg.axis()
                    .scale(y)
//                .tickSize(-width)
                    .orient("left");
            // Define the line
            var line = d3.svg.line()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y(function(d) {
                        return y(d.close);
                    });
            // Define the area
            var area = d3.svg.area()
                    .x(function(d) {
                        return x(d.date);
                    })
                    .y0(height)
                    .y1(function(d) {
                        return y(d.close);
                    });
            // Adds the svg canvas
            var chart = d3.select("#" + elementId).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("viewBox", "0 0 "
                            + (width + margin.left + margin.right) + " "
                            + (height + margin.top + margin.bottom))
                    .attr("preserveAspectRatio", "xMinYMin")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            // Parse dates and numbers, and reverse them so latest date is on right
            content.reverse().forEach(function(d) {
                d.date = parse(d._data.Date);
                d.close = +d._data.Close;
            });
            // Scale the range of the data
            x.domain([content[0].date, content[content.length - 1].date]);
            // leave some margins for the domain range so data is not touching the x
            var yMin = (d3.min(content, function(d) {
                return d.close;
            }) * 0.99);
            var yMax = (d3.max(content, function(d) {
                return d.close;
            }) * 1.01);
            y.domain([yMin, yMax]);
            // Add the valuearea path.
            chart.append("path")
                    .datum(content)
                    .attr("class", "area")
                    .attr("d", area(content));
            chart.append("g")
                    .attr("class", "x axis")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
            chart.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Price ($)");
            // Add the valueline path.        
            chart.append("path")
                    .datum(content)
                    .attr("class", "line")
                    .attr("d", line(content));
            // Mouse over value points
            var focus = chart.append("g")
                    .attr("class", "focus")
                    .style("display", "none");
            focus.append("circle")
                    .attr("r", 4.5);
            focus.append("text")
                    .attr("x", 9)
                    .attr("dy", ".35em");
            chart.append("rect")
                    .attr("class", "overlay")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mouseover", function() {
                        focus.style("display", null);
                    })
                    .on("mouseout", function() {
                        focus.style("display", "none");
                    })
                    .on("mousemove", mousemove);
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                        i = bisectDate(content, x0, 1),
                        d0 = content[i - 1],
                        d1 = content[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
                focus.select("text").text(formatCurrency(d.close));
            }
            this.set("margin", margin);
            this.set("width", width);
            this.set("height", height);
            this.set("parse", parse);
            this.set("bisectDate", bisectDate);
            this.set("formatValue", formatValue);
            this.set("formatCurrency", formatCurrency);
            this.set("x", x);
            this.set("y", y);
            this.set("xAxis", xAxis);
            this.set("yAxis", yAxis);
            this.set("line", line);
            this.set("area", area);
            this.set("chart", chart);
        }
    }
});