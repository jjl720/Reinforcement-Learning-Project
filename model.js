  // Step
var data = [1, 2, 3, 4, 5, 6];

var input,
    hidden = 2,
    output = 3,
    sub = 4;


var sliderStep = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format('1'))
    .ticks(5)
    .step(1)
    .default(4)
    .on('onchange', val => {
        input = val;
        console.log(val,'inputesdafhjkhnn');
       clear_input();
        dff = diagram(input,hidden,sub,output);
        dia(dff);
    });

var gStep = d3
    .select('div#slider-step_hidden')
    .append('svg')
    .attr('width', 400)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(50,10)');

var sliderStep_hidden = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format('1'))
    .ticks(5)
    .step(1)
    .default(3)
    .on('onchange', val => {
        hidden = val;
        console.log(input,hidden,output,'inputesdafhjkhnn');
        clear_input();
        dff = diagram(input,hidden,sub,output);
        dia(dff);
    });

var gStep_hidden = d3
    .select('div#slider-step_hidden')
    .append('svg')
    .attr('width', 400)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(50,10)');

var sliderStep_hidden_sub = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format('1'))
    .ticks(5)
    .step(1)
    .default(3)
    .on('onchange', val => {
        sub = val;
        console.log(input,hidden,output,'inputesdafhjkhnn');
        clear_input();
        dff = diagram(input,hidden,sub,output);
        dia(dff);
    });

var gStep_hidden_sub = d3
    .select('div#slider-step_hidden')
    .append('svg')
    .attr('width', 400)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(50,10)');
    
gStep.call(sliderStep);
gStep_hidden.call(sliderStep_hidden);
gStep_hidden_sub.call(sliderStep_hidden_sub);


if (sliderStep.val == undefined){
    input = 4;
} else {
    input = sliderStep.val;
}

if (sliderStep_hidden.val == undefined){
    hidden = 3;
} else {
    hidden = sliderStep_hidden.val;
}

if (sliderStep_hidden_sub.val == undefined){
    sub = 6;
} else {
    sub = sliderStep_hidden.val;
}





function clear_input(){
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();
}


function  diagram(input,hidden,sub,output){

var features = ['feat1','feat2','feat3','feat4','feat5'];
var out = ['Buy','Sell','Hold'];


var data_file = {"nodes":[]};

for (let i = 1; i < input+1; i++) {
   data_file["nodes"].push({label:features[i-1], layer: 1})
}
for (let j = 2; j < hidden+2; j++) {  
    for (let i = 1; i < sub+1; i++) {
        data_file["nodes"].push({label:'h'+j+','+i, layer: j})
    }
}
for (let i = 1; i < output+1; i++) {
    data_file["nodes"].push({label:out[i-1], layer: hidden+2})
}


return data_file
}

var dff = diagram(input,hidden,sub,output);

function dia(dff) {


var color = d3.scaleOrdinal(d3.schemeCategory10);


var nodes = dff.nodes;
    
// get network size
var netsize = {};
console.log(netsize);
nodes.forEach(function (d) {
    if(d.layer in netsize) {
        netsize[d.layer] += 1;
    } else {
        netsize[d.layer] = 1;
    }
    d["lidx"] = netsize[d.layer];
});

// calc distances between nodes
var largestLayerSize = Math.max.apply(
    null, Object.keys(netsize).map(function (i) { return netsize[i]; }));

var xdist = width / Object.keys(netsize).length,
    ydist = height / largestLayerSize;

// create node locations
nodes.map(function(d) {
    d["x"] = (d.layer - 0.5) * xdist;
    d["y"] = (d.lidx-0.5) * height/netsize[d.layer];
});

// autogenerate links
var links = [];
nodes.map(function(d, i) {
  for (var n in nodes) {
    if (d.layer + 1 == nodes[n].layer) {
      links.push({"source": parseInt(i), "target": parseInt(n), "value": 1}) }
  }
}).filter(function(d) { return typeof d !== "undefined"; });

// draw links
var link = svg.selectAll(".link")
    .data(links)
   .enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) { return nodes[d.source].x; })
    .attr("y1", function(d) { return nodes[d.source].y; })
    .attr("x2", function(d) { return nodes[d.target].x; })
    .attr("y2", function(d) { return nodes[d.target].y; })
    .style('stroke',"white")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

// draw nodes
var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; }
    );

var circle = node.append("circle")
    .attr("class", "node")
    .attr("r", nodeSize)
    .style("fill", function(d) { return color(d.layer); });

}

var width = 1000,
    height = 600,
    nodeSize = 20;

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height).attr('transform', 'translate(250,-50)');;




const rootElement = document.getElementById('mm');
           ReactDOM.render(dia(dff), rootElement);
