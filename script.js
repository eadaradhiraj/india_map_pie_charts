var metorScale = d3.scalePow().domain([0, 20]);

var width = 1000,
    height = 500;

var proj = d3.geoMercator()
    .center([81, 22])
    .scale(800)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(proj);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)

d3.json('https://raw.githubusercontent.com/eadaradhiraj/india_map_pie_charts/master/india_states_geojson.json', function (error, world) {
    d3.json('https://raw.githubusercontent.com/eadaradhiraj/india_map_pie_charts/master/data.json', function (error, data) {
      render(data, world)
    })})

function render(data, world) {

    // draw map
    svg.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "border")
        .style('fill', 'fff')
        .style('stroke', '000')

    var pie = svg.selectAll('.pie')
        .data(data).enter().append('g')

    pie
        .attr('class', 'pie')
        .attr("fill", "red")
        .attr("transform", function (d) {
            var arr = world.features.filter(function (o) {
                return (o.properties.ST_ABBR == d.state)
            })
            if (!arr.length) return;
            var p = proj(d3.geoCentroid(arr[0]));
            return "translate(" + p + ")";
        });

    var pieData = d3.pie()
        .value(function (d) {
            return d.medals;
        })

    var g = pie.selectAll('g')
        .data(function (d) {
            var pieSize = metorScale(d.total)
            return pieData([{
                    'key': 'gold',
                    'medals': d.gold,
                    'pieSize': pieSize
                },
                {
                    'key': 'silver',
                    'medals': d.silver,
                    'pieSize': pieSize
                },
                {
                    'key': 'bronze',
                    'medals': d.bronze,
                    'pieSize': pieSize
                }
            ])
        }).enter().append('g')
        .attr('class', 'arc')

    var arc = d3.arc()
        .outerRadius(function (d) {
            return (d.data.pieSize)
        })
        .innerRadius(0);

    g.append('path')
        .attr('d', arc)
        .attr("fill", function (d) {
            return (d.data.key)
        })

}
