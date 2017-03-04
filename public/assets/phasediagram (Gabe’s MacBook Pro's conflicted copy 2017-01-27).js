function phaseDiagram(divin) {

  var totalIters = 500

  function getTrace(alpha, beta, coord, sign) {
    var m = []
    var lambda = [1,100]
    var iter = geniterMomentum([[1, 0],[0, 1]], lambda, [1,sign*100], alpha, beta)
    // run for 500 iterations
    for (var i = 0; i <= totalIters; i++) { 
      var x = numeric.add(iter(i)[1],-sign*1)
      var y = numeric.mul(iter(i)[0],(1/200))
      m.push([y[coord], x[coord]])
    }
    mG = m
    return m
  }

  var w = 300;
  var h = 300
  var a = 1.0
  axis = [[-a*5,a*5],[-a,a]]

  for (var i = 0; i < 3; i ++ ) {

    var div = divin.append("div")

      .style("position","absolute")
      .style("width",w + "px")
      .style("height",h + "px")
      .style("left", i*(w + 20)  + "px")

    var svg = div.append("svg")
        .style("position", 'absolute')
        .style("left", 0)
        .style("top", "30px")
        .style("width", w)
        .style("height", h)
      .style("box-shadow","rgba(0, 0, 0, 0.4) 0px 3px 10px")
      .style("border","1px solid black")
    var X = d3.scaleLinear().domain(axis[0]).range([0, w])
    var Y = d3.scaleLinear().domain(axis[1]).range([0, h])

    svg.append("g").attr("class", "grid")
      .attr("transform", "translate(0," + h/2 +")")
      .attr("opacity", 0.5)
      .call(d3.axisBottom(X).ticks(0).tickSize(4))

    svg.append("g").attr("class", "grid")
      .attr("transform", "translate(" + w/2 + ",0)")
      .attr("opacity", 0.5)      
      .call(d3.axisLeft(X).ticks(0).tickSize(4))

    var colorRange = d3.scaleLinear().domain([0, totalIters/16, totalIters/2]).range(colorbrewer.OrRd[3])
    var update = plot2dGen(X, Y, colorRange)
                  .pathOpacity(1)
                  .pathWidth(1.5)
                  .circleRadius(1.5) 
                  .stroke(colorbrewer.OrRd[3][0])(svg)

    var al = 0.0001
    var optbeta = Math.pow(1 - Math.sqrt(al*100),2)
    update(getTrace(al, [0.01, optbeta + 0.0001, 0.999][i], 1,1))

    div.append("span")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", w + "px")
      .style("font-size", "14px")
      .html(["Underdamped, $\\beta < 1-\\alpha\\lambda_i-\\sqrt{\\alpha\\lambda_i}$",
             "Critically Damped, $\\beta = 1-\\alpha\\lambda_i-\\sqrt{\\alpha\\lambda_i}$", 
             "Overdamped, $\\beta > 1-\\alpha\\lambda_i-\\sqrt{\\alpha\\lambda_i}$"][i])


    div.append("span")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", w + "px")
      .style("top", (h + 30) + "px")
      .style("font-size", "14px")
      .html(["$y_i$",
             "$y_i$", 
             "$y_i$"][i])

    if (i == 0) {

      div.append("span")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", 10 + "px")
        .style("top", (h + 30)/2 + "px")
        .style("font-size", "14px")
        .style("left", "-20px")
        .html("$x_i$")

    }
  }
}