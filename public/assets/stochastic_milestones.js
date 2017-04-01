function renderStochasticMilestones(div, updateTick) {

  var lambda = [1,10,100]
  var totalIters = 151  

  div.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 3) 
      .attr("refY", 2)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
          .attr("d", "M 0,0 V 4 L4,2 Z"); //this is actual shape for arrowhead

  var lam = 1
  var epsilon = 3

  var f = function(x) { 
    var fx = 0.5*(lam*x[0]*x[0])
    var g  = [lam*x[0]]
    return [fx, g]
  }

  /*
    Gets information about iterates with certain parameter alpha and beta.
    > v = getTrace(0.5, 0)
    v[0] -> z iterates
    v[1] -> w iterates
    v[2] -> [c1, c2, c3] where c1, c2, c3 are the contributions to the loss
  */
  function getTrace(alpha, beta) {

    var Rmat = function (i) {
      return [[ beta  , lam ],
              [  -1*alpha*beta    , 1 - alpha*lam] ]
    }

    var R = Rmat(1)
    var w0 = [Math.sqrt(3)]
    var v = runMomentum(f, w0, alpha, beta, totalIters)
    var fxstack = []
    var errx = [epsilon, -alpha*epsilon]
    var errsum = 0
    // Add contributions to the objective
    for (var i = 0; i < v[0].length; i++) {
      errsum = errsum + errx[1]*errx[1]
      errx = numeric.dot(R, errx)
      var x = v[1][i]
      fxstack.push([lam*x[0]*x[0]/2 ,errsum])
    }
    v.push(fxstack)
    return v
  }

  var stackedBar = stackedBarchartGen(totalIters, 2).col(colorbrewer.BuPu).translatey(30).translatex(110)(div) 
  
  div.append("rect").attr("x", 0).attr("y", 0).attr("width", 1000).attr("height", 30).attr("fill", "white")

  var seperation = 14


  var progressmeter = div.append("g")

  var textl = progressmeter.append("g").attr("transform", "translate(-120,-10)")

  textl.append("line")
       .attr("y1",-5)
       .attr("y2",-5)
       .attr("x1",110)
       .attr("x2",120)
       .attr("stroke","black")
       .attr("stroke-width", 1.5)
       .attr("marker-end", "url(#arrowhead)")

  textl.append("text")
       .attr("class", "figtext2")
       .text("Stochastic regime")

  var textr = progressmeter.append("g").attr("transform", "translate(100,-10)")

  textr.append("text")
       .attr("class", "figtext2")
       .attr("text-anchor", "end")
       .text("Deterministic regime")


  textr.append("line")
       .attr("y1",-5)
       .attr("y2",-5)
       .attr("x1",-123)
       .attr("x2",-133)
       .attr("stroke","black")
       .attr("stroke-width", 1.5)
       .attr("marker-end", "url(#arrowhead)")

  var divider = progressmeter.append("line")
            .style("stroke", "black")
            .style("stroke-width",1.5)
            .attr("opacity", 0.9)

  var divider2 = progressmeter.append("line")
            .style("stroke", "white")
            .style("stroke-width",5)
            .attr("opacity", 0.4)

  var updateStep = function(alpha, beta) {
    var trace = getTrace(alpha/lambda[2], beta)
    // Update the milestones on the slider
    var milestones = [0,0]
    for (var i = 0; i < trace[1].length; i++) {
      if (trace[2][i][0] > trace[2][i][1]) { milestones[0] = i;  milestones[1] = i; } else { break}
    }
    stackedBar.update(trace[2], milestones)

    var endpoint = stackedBar.stack[0].selectAll("line").nodes()[milestones[0]]
    var stack = endpoint.getBBox()
    var ctm = endpoint.getCTM()

    if (milestones[0] < 150) {
      textl.attr("transform", "translate(" + (stack.x + 10) + ",-15)").style("visibility", "visible")
      textr.attr("transform", "translate(" + (stack.x - 10) + ",-15)").style("visibility", "visible")
      divider.attr("x2", stack.x)
              .attr("y2", -25)
              .attr("x1", stack.x)
              .attr("y1", 160)      
              .style("visibility", "visible")
      divider2.attr("x2", stack.x)
              .attr("y2", -25)
              .attr("x1", stack.x)
              .attr("y1", 160)      
              .style("visibility", "visible")              
    } else {
      divider.style("visibility", "hidden")
      textl.style("visibility", "hidden")
      textr.style("visibility", "hidden")

    }
    setTM(progressmeter.node(), ctm)

  }

  updateStep(100*2/(101.5), 0)

  return updateStep
}