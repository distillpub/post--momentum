function phaseDiagram(divin) {

  var totalIters = 150
  var default_underdamp = 0.97
  var default_overdamp = 0.05

  function getTrace(alpha, beta, lambda) {
    var m = []
    var iter = geniterMomentum([[1, 0],[0, 1]], lambda, [1,1*100], alpha, beta)
    // run for 500 iterations
    for (var i = 0; i <= totalIters; i++) { 
      var x = numeric.add(iter(i)[1],-1*1)
      var y = numeric.mul(iter(i)[0],(1/200))
      m.push([y[1], x[1]])
    }
    mG = m
    return m
  }

  var al = 0.0001
  var optbeta = Math.pow(1 - Math.sqrt(al*100),2)

  var w = 170
  var h = 170
  var a = 1.0

  var axis = [[-a*5,a*5],[-a,a]]
  var width_bar = 620
  var X = d3.scaleLinear().domain([0,1]).range([0, width_bar])

  var valueline = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

  var overlay = divin.append("svg")
       .style("position", "absolute")
       .attr("width", 648)
       .attr("height", 520)
       .style("z-index", 10)
       .style("pointer-events", "none")

  // Draw the three phases
  for (var i = 0; i < 3; i ++ ) {

    var div = divin.append("div")
      .style("position","absolute")
      .style("width",w + "px")
      .style("height",h + "px")
      .style("left", [15, 235, 455][i] + "px")
      .style("top", [110, 110, 110][i] + "px")

    var svg = div.append("svg")
                .style("position", 'absolute')
                .style("left", 0)
                .style("top", "0px")
                .style("width", w)
                .style("height", h)
      .style("border-radius", "5px")

    svg.append("g").attr("class", "grid")
      .attr("transform", "translate(0," + h/2 +")")
      .attr("opacity", 0.5)
      .call(d3.axisBottom(X).ticks(0).tickSize(4))

    svg.append("g").attr("class", "grid")
      .attr("transform", "translate(" + w/2 + ",0)")
      .attr("opacity", 0.5)      
      .call(d3.axisLeft(X).ticks(0).tickSize(4))

    var colorRange = d3.scaleLinear().domain([0, totalIters/16, totalIters/2]).range(colorbrewer.OrRd[3])
    
    var Xaxis = d3.scaleLinear().domain(axis[0]).range([0, w])
    var Yaxis = d3.scaleLinear().domain(axis[1]).range([0, h])

    var update = plot2dGen(Xaxis, Yaxis, colorRange)
                  .pathOpacity(1)
                  .pathWidth(1.5)
                  .circleRadius(1.5) 
                  .stroke(colorbrewer.OrRd[3][0])(svg)

    update(getTrace(al, [0.01, optbeta + 0.0001 , default_underdamp][i], [0,10]))

  }



}