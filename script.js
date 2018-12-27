var metorScale = d3.scalePow().domain([0, 300]);
var colorScale = d3.scaleLinear().domain([1400, 1800, 1860, 1940, 2015]);
var color = d3.scaleOrdinal(d3.schemeCategory20);

var width = 1000,
    height = 500;

var proj = d3.geoMercator()
    .center([15, 42])
    .scale(2000)

var path = d3.geoPath()
    .projection(proj);

var arc = d3.arc()
    .outerRadius(function (d) {
        return d.data.pieSize
    })
    .innerRadius(0);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)

// d3.json('italy_regions.json', function (error, world) {
//     console.log(world)
//     render(error, data, world)
// })
render(data, italy_regions)

function render(data, world) {
    // console.log(JSON.stringify(data, null, 2))

    // draw map
    svg.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "border")

    var pies = svg.selectAll('.pie')
        .data(data);

    pies.enter().append('g')
        .attr('class', 'pie')
        .attr("fill", "red")
        .attr("transform", function (d) {
            var arr = world.features.filter(function (o) {
                return (o.properties.name.toLowerCase() == d.key.toLowerCase())
            })
            if (!arr.length) return;
            var p = proj(d3.geoCentroid(arr[0]));
            return "translate(" + p + ")";
        });

    var pieData = d3.pie()
        .value(function (d) {
            console.log('hIIIIIIII')
            return d.interactions;
        });

    var pie = pies.selectAll('g')
        .data(function (d) {
            var pieSize = metorScale(d.interactions)
            if (d.topics)
                d.topics.map(function (t) {
                    t.pieSize = pieSize;
                    return t;
                })
            return d.topics ? pieData(d.topics) : []
        }).enter().append('g') // create g elements inside each pie
        .attr('class', 'arc')

    pie.append('path')
        .attr('d', arc)
        .attr("fill", function (d, i) {
            console.log(d)
            return color(i);
        })

}