var canvas = d3.select("#map")
  .attr("width", 1300)
	.attr("height", 600);

var words = ['love','happiness','money','success','career','power','desire','necessity','comfort','home','family'];
var connections = [];
var yPositions = [];
var xPositions = [];

//function that makes the x postion of the words not overlap
function getValidXPosition() {
  var num = Math.random() * 1200;
  var isValid = true;
  for (var i = 0; i < xPositions.length; i++) {
    if (Math.abs(num - xPositions[i]) < 40) {
      isValid = false;
    }
  }

  if (isValid) {
    xPositions.push(num)
    return num;
  } else {
    return getValidXPosition();
  }
}


//function that makes the y position of the words not overalp
function getValidYPosition() {
  var num = Math.random() * 600;
  var isValid = true;
  for (var i = 0; i < yPositions.length; i++) {
    if (Math.abs(num - yPositions[i]) < 40) {
      isValid = false;
    }
  }

  if (isValid) {
    yPositions.push(num)
    return num;
  } else {
    return getValidYPosition();
  }
}

var container = canvas.append("g");

// various funtctions,varables to be called later
var dragCache = {
  from: false,
  to: false
}

function dist(a, b) {
  return Math.sqrt(
    Math.pow((a.x - b.x), 2) +
    Math.pow((a.y - b.y), 2)
  )
}

function getNodeById(id) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i]
    }
  }

  return false;
}


//generate d3 data
var data = (function(){
  var arr = [];
  for (var i = 0; i< words.length; i++){
    arr.push({
      name: words[i],
      id: i,
      x: getValidXPosition(),
      y: getValidYPosition()

    });
  }

console.log(arr)

  return arr;
})()

//creating dragStarted, dragged, and dragEnded functions
function dragStarted (d, i){
  dragCache.from = d.id
}

function dragged (d, i){
  for (var i = 0; i < data.length; i++){
    var m = d3.mouse(this)
    var distance = dist({x:m[0], y: m[1]}, data[i]);
    // console.log(data[i])
    // console.log(distance)
    if (distance < 20) {
      dragCache.to = data[i].id;
    }
  }

// for the ghost line when clicking
  var ghostLine = container.selectAll('.ghost')
    .data([dragCache])

  ghostLine.enter()
      .append('line')
      .attr('class', 'ghost')
      .attr('stroke', '#fff')

  ghostLine
      .attr('x1', function (d) { return getNodeById(d.from).x })
      .attr('y1', function (d) { return getNodeById(d.from).y })
      .attr('x2', d3.mouse(this)[0])
      .attr('y2', d3.mouse(this)[1])
}

function dragEnded (d, i){

  // console.log(dragCache)
  container.selectAll('.ghost').remove()

  if (dragCache.to !== false && dragCache.from !== false){
  connections.push({
    from: dragCache.from,
    to: dragCache.to
  })
  drawStuff()
}
  dragCache.to = false
  dragCache.from = false
}


//aranges words & calls dragStarted, dragged and dragEnded function

function drawStuff(){

  var wordEls = container.selectAll('.words')
    .data(data);

  wordEls.enter().append('text')
    .attr("x", function (d, i) { return d.x})
    .attr("y", function (d, i) { return d.y})
    .attr("fill","black")
    .attr("font-size","2em")
    .attr("text-anchor", "middle")
    .attr("class","pointer")
    .text(function (d){return d.name})
    .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

//function/variable for connections
    var connectionsDrawing = container.selectAll('.connection')
      .data(connections)

    connectionsDrawing.enter()
        .append('line')
        .attr('class', 'connection')

    connectionsDrawing
        .attr('x1', function (d) { return getNodeById(d.from).x })
        .attr('x2', function (d) { return getNodeById(d.to).x })
        .attr('y1', function (d) { return getNodeById(d.from).y })
        .attr('y2', function (d) { return getNodeById(d.to).y })
        .attr("stroke", "white")

    console.log(connectionsDrawing)


}
//actually makes the drawings
drawStuff()

//Makes arrow scroll
function pageScroll() {
        window.scrollBy(0,1000); // horizontal and vertical scroll increments
}
