var metorScale = d3.scalePow().domain([0, 10]);
var colorScale = d3.scaleLinear().domain([1400, 1800, 1860, 1940, 2015]);
var color = d3.scaleOrdinal(d3.schemeCategory20);

var width = 1000,
    height = 500;

var proj =  d3.geoMercator()
				   .center([81,22])
				   .scale(800)
				   .translate([width/2,height/2]);

var path = d3.geoPath()
    .projection(proj);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)

// d3.json('https://gist.githubusercontent.com/lmatteis/5da1af2490e38e01f44d48f2b9af81e7/raw/5243148ae0590bf0ceee837b3ec73ca0cba36f1c/italy-regions.json', function (error, world) {
//     render(data, world)
// })
render(data, india_states)

function render(data, world) {

    // draw map
    svg.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "border")

    var pie = svg.selectAll('.pie')
        .data(data).enter().append('g')

    pie
        .attr('class', 'pie')
        .attr("fill", "red")
        .attr("transform", function (d) {
            var arr = world.features.filter(function (o) {

                return (o.properties.ST_ABBR == d.key)
            })
            if (!arr.length) return;
            var p = proj(d3.geoCentroid(arr[0]));
            return "translate(" + p + ")";
        });

    var pie_data=[];
        for( var a=0;a<data.length;a++){ // simple logic to calculate percentage data for the pie
        pie_data[a]=data[a].medals
        }
    console.log(pie_data)

    var pieData = d3.pie()
        // .value(function (d) {
        //     return d;
        // })
        .value(function(_,i) { return metorScale(pie_data[i]); })
        .sort(null);

    var g = pie.selectAll('g')
        .data(pieData(data)).enter().append('g')
        .attr('class', 'arc')

    var arc = d3.arc()
        // .outerRadius(function (d) {
        //     // console.log(d)
        //     return metorScale(d.medals)
        // })
        .outerRadius(40)
        .innerRadius(0);

    g.append('path')
        .attr('d', arc)
        .attr("fill", function (d, i) {
            return color(i);
        })

}