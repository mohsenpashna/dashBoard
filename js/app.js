var data=[];




function crateRandData(){
    var weekInMS = 604800*1000;
    var dateNow = Date.now(); 
    var trimT =   dateNow - (dateNow % weekInMS);
    
    for(var i=0; i< 1000; i++){
    var d = {time:"", rate: ""};
        var t = trimT + Math.floor(weekInMS*Math.random());
        var r = Math.floor(5*Math.random()+1);
        d.time = t;
        d.rate = r;
        data = data.concat(d);
        delete d;
//        data = jsonConcat(data, d);
    }
//    console.log(data);
}

crateRandData();


var functionHist = function(d){
    var len = d.length;
    var arr = [0,0,0,0,0];
    for(var i=0; i<len; i++){
        arr[d[i].rate-1]++;
    }
    return arr;
}

console.log(functionHist(data));


var svg = d3.select("body")
        .append("svg")
        .append("g")

svg.append("g")
    .attr("class", "slices");

svg.append("g")
    .attr("class", "labels");

svg.append("g")
    .attr("class", "lines");


var width = 600,
    height = 450,
    radius = Math.min(width, height)/3;


var pie = d3.layout.pie()
            .sort(null)
            .value(function(d){return d.value;})
    

var arc = d3.svg.arc()
    .outerRadius(radius * .8)
    .innerRadius(radius * .4);


var outerArc = d3.svg.arc()
    .innerRadius(radius *.9)
    .outerRadius(radius * .9);



svg.attr("transform", "translate(" + width / 1.5 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };
//console.log(key);
var color = d3.scale.linear()
	.domain([1,2,3,4,5])
	.range(["#98abc5", "#8a89a6", "#7b6888",  "#d0743c", "#ff8c00"]);


function randomData (){
	var labels = color.domain();
	return labels.map(function(label){
		return { label: label, value: Math.random() }
	});
}

function myData(){
    var labels = [1,2,3,4,5];
    return{label:labels, value: (functionHist(data))/(d3.sum(functionHist(data)))};
}


change(randomData());

d3.select(".randomize")
	.on("click", function(){
    myData();
//		change(randomData());
//		change(crateRandData());
	});



function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();
};

