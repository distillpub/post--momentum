function phaseDiagram(divin) {

  var totalIters = 200

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

  var textCaptions = ["<b>Overdamping</b><br> When $\\beta$ is too small (e.g. in Gradient Descent, $\\beta = 0$), we're over-damping. The particle is immersed in a viscous fluid which saps it of its kinetic energy at every timestep.","<b>Critical Damping</b><br> The best value of $\\beta$ must lie somewhere in the middle. This sweet spot, the critical damping rate, happens exactly when the eigenvalues of $R$ are repeated, which happens when $\\beta = (1 - \\sqrt{\\alpha \\lambda_i})^2$ ","<b>Underdamping</b><br> When $\\beta$, is too large, we're under-damping. Here's there's no resistance at all, and spring oscillates up and down forever, missing the optimal value over and over. "]

  var al = 0.0001
  var optbeta = Math.pow(1 - Math.sqrt(al*100),2)

  var w = 220;
  var h = 220
  var a = 1.0
  axis = [[-a*5,a*5],[-a,a]]

  var valueline = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

  var updateCallbacks = []
  for (var i = 0; i < 3; i ++ ) {

    var div = divin.append("div")
      .style("position","absolute")
      .style("width",w + "px")
      .style("height",h + "px")
      .style("left", [200, 550, 700][i] + "px")
      .style("top", [10, 285, 10][i] + "px")

    div.append("span")
      .style("position","absolute")
      .style("width", "180px")
      .style("height", "200px")
      .style("font-size", "13px")
      .style("line-height", "18px")
      .style("font-family", "Open Sans")        
      .style("text-align", "right")
      .style("top", [10, 40, 75][i] + "px")
      .style("left", "-200px")
      .style("color", "gray")  
      .html(textCaptions[i])

    var svg = div.append("svg")
                .style("position", 'absolute')
                .style("left", 0)
                .style("top", "0px")
                .style("width", w)
                .style("height", h)
      .style("box-shadow","rgba(0, 0, 0, 0.4) 0px 3px 10px")
      .style("border","1px solid black")
      .style("border-radius", "5px")

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

    update(getTrace(al, [0.01, optbeta + 0.0001 , 0.999][i], 1,1))
    updateCallbacks.push(update)

    div.append("span")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", w + "px")
      .style("top", function(d) { return [-15, h + 15, -20][i] + "px"} )
      .style("font-size", "12px")
      .html(["$y_i$",
             "$y_i$", 
             "$y_i$"][i])

    div.append("span")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", (2*w + 80) + "px")
      .style("top", (h - 5)/2 + "px")
      .style("font-size", "12px")
      .style("left", "-20px")
      .html("$x_i$")

  }

  var linesvg = d3.select("#phasediagram")
    .append("svg")

  var w = 910
  var X = d3.scaleLinear().domain([0,1]).range([0, w])

  linesvg.style("position","absolute")
    .style("width", "920px")
    .style("height", "570px")
    .style("left", "10px")
    .on("mousemove", function () { console.log (d3.mouse(this))})
    .append("line")
    .attr("x1", 5)
    .attr("y1", 260)
    .attr("x2", 5 + w)
    .attr("y2", 260)    
    .style("border", "solid 2px black")
    .style("stroke", "black")
    .style("fill", "white")
    .style("stroke-width", "1px")

  function genPath(s1, s2, e1, e2) {
    if (s2 < e2) {
      return valueline([ [s1,s2], 
                         [s1,s2 + 10], 
                         [e1,e2 - 5],
                         [e1,e2]] )
    } else {
      return valueline([ [s1,s2], 
                         [s1,s2 - 10], 
                         [e1,e2 + 5],
                         [e1,e2]] )      
    }
  }

  var connectLines = []
  for (var i = 0; i < 3; i++ ){

    var connectLine = linesvg.append("path")
      .attr("opacity", 1)
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("stroke-linecap","round")
      .attr("d", genPath([X(0.1), X(optbeta), X(0.999)][i], 260, 
                          [302, 652, 802][i], [232,285,232][i] ))

    connectLines.push(connectLine)
  }

  var underdamp = linesvg
        .append("circle")
        .attr("cx", X(0.1))
        .attr("cy", 260)
        .attr("r", 4)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px")


  var criticaldamp = linesvg
        .append("circle")
        .attr("cx", X(optbeta))
        .attr("cy", 260)
        .attr("r", 2)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px")


  var overdamp = linesvg
        .append("circle")
        .attr("cx", X(0.99))
        .attr("cy", 260)
        .attr("r", 4)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px")

  linesvg.style("position","absolute")
    .style("width", "920px")
    .style("height", "570px")
    .append("line")
    .attr("x1", 5)
    .attr("y1", 260)
    .attr("x2", 5 + w)
    .attr("y2", 260)    
    .style("border", "solid 2px black")
    .style("stroke", "black")
    .style("fill", "white")
    .style("opacity", 0)
    .style("z-index", 3)    
    .style("stroke-width", "40px")
    .on("mousemove", function () { 

      var pt = d3.mouse(this)
      var beta = X.invert(pt[0])
      if (beta < optbeta) {
        underdamp.transition().duration(20).attr("cx", pt[0])
        updateCallbacks[0](getTrace(al, X.invert(pt[0]), 1,1)) 
        connectLines[0].transition().duration(20).attr("d", genPath(pt[0], 260, 302, 232 ))

        overdamp.transition().duration(100).attr("cx", X(0.999))
        updateCallbacks[2](getTrace(al, 0.999, 1,1)) 
        connectLines[2].transition().duration(20).attr("d", genPath(X(0.999), 260, 802, 232 ))

      } 
      if (beta > optbeta) {
        overdamp.transition().duration(20).attr("cx", pt[0])        
        updateCallbacks[2](getTrace(al, Math.min(X.invert(pt[0]),1), 1,1))      
        connectLines[2].transition().duration(20).attr("d", genPath(pt[0], 260, 802, 232 ))

        underdamp.transition().duration(100).attr("cx", X(0.1))
        updateCallbacks[0](getTrace(al, 0.1, 1,1))      
        connectLines[0].transition().duration(20).attr("d", genPath(X(0.1), 260, 302, 232 ))

      } 

    })
    .on("mouseout", function () { 

      underdamp.transition().duration(300).attr("cx", X(0.1))
      updateCallbacks[0](getTrace(al, 0.1, 1,1))      
      connectLines[0].transition().duration(300).attr("d", genPath(X(0.1), 260, 302, 232 ))

      overdamp.transition().duration(300).attr("cx", X(0.999))
      updateCallbacks[2](getTrace(al, 0.999, 1,1))      
      connectLines[2].transition().duration(300).attr("d", genPath(X(0.999), 260, 802, 232 ))
    })

  divin.append("span")
    .style("position","absolute")
    .style("width", "10px")
    .style("height", "10px")
    .style("font-size", "20px")
    .style("line-height", "18px")
    .style("font-family", "Open Sans")        
    .style("text-align", "right")
    .style("top", "250px")
    .style("left", "-3px")
    .style("color", "gray")  
    .html("$\\beta$")


  divin.append("span")
    .style("position","absolute")
    .style("width", "10px")
    .style("height", "10px")
    .style("font-size", "15px")
    .style("line-height", "18px")
    .style("font-family", "Open Sans")        
    .style("text-align", "right")
    .style("top", "266px")
    .style("left", "12px")
    .style("color", "gray")  
    .html("$0$")


  divin.append("span")
    .style("position","absolute")
    .style("width", "10px")
    .style("height", "10px")
    .style("font-size", "15px")
    .style("line-height", "18px")
    .style("font-family", "Open Sans")        
    .style("text-align", "right")
    .style("top", "266px")
    .style("left", "916px")
    .style("color", "gray")  
    .html("$1$")

}