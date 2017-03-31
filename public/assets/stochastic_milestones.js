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

  var markers = []
  for (var i = 0; i < 3; i ++) {
    var marker = div.append("defs").append("marker")
      .attr("id", "arrowhead" + i)
      .attr("refX", 0) 
      .attr("refY", 1)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M 0,0 V 2 L2,1 Z") //this is actual shape for arrowhead
        .attr("fill", colorbrewer.BuPu[3][i])
      markers.push(marker)
  }

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
      // lam*x[0]*x[0]/2
      fxstack.push([lam*x[0]*x[0]/2 ,errsum, 0])
    }
    v.push(fxstack)
    return v
  }

  var stackedBar = stackedBarchartGen(totalIters, 2).col(colorbrewer.BuPu)(div) 
  
  var seperation = 14

  var r = []
  var lines = []

  var progressmeter = div.append("g")
  for (var i = 0; i < 1; i ++) {
    var ri = progressmeter.append("line")
      .attr("x1", stackedBar.X(-1) + "px")
      .attr("y1", (202 + i*seperation)+ "px")
      .attr("stroke", colorbrewer.BuPu[3][i])
      .attr("y2", (202 + i*seperation) + "px")
      .attr("stroke-width", 4)
    r.push(ri)

    var linei = progressmeter.append("line")
              .style("stroke", "black")
              .style("stroke-width",1.5)
              .attr("marker-end", "url(#arrowhead)")
              .attr("opacity", 0.6)
    lines.push(linei)

  }


  var updateStep = function(alpha, beta) {
    var trace = getTrace(alpha/lambda[2], beta)
    // Update the milestones on the slider
    var milestones = [0,0]
    for (var i = 0; i < trace[1].length; i++) {
      if (trace[2][i][0] > trace[2][i][1]) { milestones[0] = i;  milestones[1] = i }
    }
    console.log(milestones)
    stackedBar.update(trace[2], milestones)

    for (var i = 0; i < 1; i++) {

      var endpoint = stackedBar.stack[i].selectAll("line").nodes()[milestones[i]]
      var stack = endpoint.getBBox()
      var ctm = endpoint.getCTM()
      if (milestones[0] < 150) {
        lines[i].attr("x2", stack.x)
                .attr("y2", stack.y + 5)
                .attr("x1", stack.x)
                .attr("y1", 203.5 + seperation*(i))      
                .style("visibility", "visible")
        r[i].attr("marker-end", "url()")   
      } else {
        lines[i].style("visibility", "hidden")
        r[i].attr("marker-end", "url(#arrowhead" + i + ")")   
      }
      //setTM(lines[i].node(), ctm) // transform the lines into stackedplot space
      r[i].attr("x2", (stackedBar.X(milestones[0]) - 2) + "px")
      
      //setTM(r[i].node(), ctm) // transform the lines into stackedplot space
      setTM(progressmeter.node(), ctm)
    }
  }

  updateStep(100*2/(101.5), 0)

  return updateStep
}