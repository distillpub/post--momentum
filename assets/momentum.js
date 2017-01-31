/*
  Render the whole momentum widget
*/
function renderMomentum(div) {

  var valueline = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

  function genPath(s1, s2, e1, e2) {
    if (s2 > e2) {
      return valueline([ [s1,s2], 
                         [s1,s2 - 5],
                         [e1,e2]] )
    } else {
      return valueline([ [s1,s2], 
                         [s1,s2 + 5],
                         [e1,e2]] )      
    }
  }

  function drawPath(svg, s1, s2, e1, e2) {

    svg.append("path")
        .attr("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("stroke-linecap","round")
        .attr("d", genPath( s1, s2, e1, e2 ))

  }
  var num_iters = 40

  function getTrace(alpha, beta, xy, coord) {
    var m = []
    var lambda = [1,100]
    var iter = geniterMomentum([[1, 0],[0, 1]], lambda, lambda, alpha, beta)
    // run for 500 iterations
    for (var i = 0; i <= num_iters; i++) { 
      if (xy == 1) {  m.push(numeric.add(iter(i)[xy],-1)) }
      if (xy == 0) {  m.push(numeric.mul(iter(i)[xy],0.005)) }
    }
    return numeric.transpose(m)[coord]
  }

  function genPhase(t,l,textside, text) {

    var outdiv = div.style("display", "block")
                   .style("margin-left","auto")
                   .style("margin-right","auto")
                   .style("position", "relative")
                   .style("width", "920px")
                   .style("height", "550px")
                   .style("border-radius", "5px")
                    .on("click", function () { console.log(d3.mouse(this)) })

    var outdiv = outdiv.append("div")
                .style("position", "absolute")
                .style("top", t+"px")
                .style("left", l +"px")

    var updatePath = stemGraphGen(180, 130, num_iters)
                        .radius1(1)
                        .axis([-1.4, 1.4])
                        .labelSize("0px")
                        .numTicks(2)
                        (outdiv)

    if (textside == "left") { 
      outdiv.append("span")
        .style("position", "absolute")
        .style("top","20px")
        .style("left", "-155px")
        .style("width", "150px")
        .style("height", "130px")
        .style("font-size", "13px")
        .style("line-height", "18px")
        .style("font-family", "Open Sans")        
        .style("color", "gray")
        .style("text-align", "right")                
        .html(text)
    }


    if (textside == "right") { 
      outdiv.append("span")
        .style("position", "absolute")
        .style("top","20px")
        .style("left", "200px")
        .style("width", "150px")
        .style("height", "130px")
        .style("font-size", "13px")
        .style("line-height", "18px")
        .style("font-family", "Open Sans")        
        .style("text-align", "left")   
        .style("color", "gray")                     
        .html(text)
    }

    return updatePath
  }

  var updateDR = genPhase(10,260,"left", "<b>Dampened Ripples</b> <br> R's eigenvalues are complex, have norm $\\leq 1$. $0 \\leq \\alpha \\leq 2/\\lambda_i$. The iterates display low frequency ripples as they spiral to 0.")
  updateDR(getTrace(0.0017,0.94,1,1))

  var updateDD = genPhase(10,490,"right","<b>Dampened Divergence</b> R's eigenvalues are complex, and have a norm less than one. $\\alpha \\geq 2/\\lambda_i$ causes a increase initial spike (we'd have diverged without momentum) before converging.")
  updateDD(getTrace(0.019,0.84,1,1))

  var updateMC = genPhase(185,110,"left","<b>Monotonic Convergence</b> R's eigenvalues are both real, are positive, and have norm less than one. The behavior here resembles gradient descent.")
  updateMC(getTrace(0.00093, 0.16,1,1))

  var updateD = genPhase(185,620,"right","<b>Divergence</b> When $\\max\\{\\sigma_1,\\sigma_2\\} > 1$, the iterates diverge.")
  updateD(getTrace(0.0213, 0.06,1,1))

  var updateIC = genPhase(370,260,"left","<b>Immediate Convergence</b> When $\\alpha = 1/\\lambda_i$, and $\\beta = 0$, we converge in one step. This is a very special point, and kills the error in the eigenspace completely.")
  updateIC(getTrace(0.01, 0.0001,1,1))

  var updateMO = genPhase(370,490,"right","<b>Monotonic Oscillations</b> When $\\alpha > 1/\\lambda_i$, the sign of the term in the power is negative. The iterates flip between $+$ and $-$ at each step.")
  updateMO(getTrace(0.02, 0.045,1,1))

  var svg = div.append("svg")
              .style("position", "absolute")
              .style("width","920px")
              .style("height","500px")
              .style("z-index", 3)
              .style("pointer-events","none")

  drawPath( svg, 352, 162, 340, 240 ) // Dampened Ripples
  drawPath( svg, 586, 162, 514, 245 ) // Dampened Divergence
  drawPath( svg, 348, 390, 396, 343 ) // Immediate Convergence
  drawPath( svg, 583, 390, 446, 335 ) // Monotonic Oscillation
  drawPath( svg, 296, 272, 337, 322 ) // Monotonic Convergence
  drawPath( svg, 626, 273, 482, 332 ) // Divergence

  function wrap(f) {
    return function(alpha, beta) {
      return f(getTrace(alpha, beta, 1,1))
    }
  }

  render2DSliderGen(wrap(updateDR), wrap(updateDD), wrap(updateIC), wrap(updateMO), wrap(updateMC), wrap(updateD))(div)

  div.append("span").style("top", "360px").style("left", "455px").attr("class", "figtext").html("$\\alpha_i\\lambda_i$")
  div.append("span").style("top", "261px").style("left", "309px").attr("class", "figtext").html("$\\beta$")

}

/*
  Render 2D slider thingy to the right.
*/
function render2DSliderGen(updateDR, updateDD, updateIC, updateMO, updateMC, updateD) {

  var slider2Dtop = 200           // Margin at top
  var slider2D_size = 140;        // Dimensions (square) of 2D Slider
  var slider2Dleft = (920/2) - 135  // How far to the left to put the 2D Slider

  function render2DSlider(divin){

    function getEigs(alpha, beta,lambda) {
      var E = [[ beta          , lambda          ], 
              [ -1*alpha*beta , 1 - alpha*lambda]]
      return numeric.eig(E)["lambda"]
    }

    var div = divin
      .append("div")
      .style("position","absolute")
      .attr("class", "d3-tip n")
      .style("z-index", 2)
      .html("s1 = <br> s2 = <br> complex")
      .style("opacity",0)

    var ybeta  = d3.scaleLinear().domain([1,0]).range([0, slider2D_size]);
    var xalpha = d3.scaleLinear().domain([0,4/100]).range([0, 2*slider2D_size]);

    var canvas = divin
      .append('canvas')
        .style("position", 'absolute')
        .style("left", slider2Dleft + "px")
        .style("top", slider2Dtop + "px")
        .style("width", 2*slider2D_size)
        .style("height", slider2D_size)
        .attr("width", 2*slider2D_size)
        .attr("height", slider2D_size)
        .style("z-index", 1)
        .style("border", "solid 1px black")
        .style("box-shadow","0px 3px 10px rgba(0, 0, 0, 0.4)")
        .on("mousemove", function() {

          var pt = d3.mouse(this)
          var alpha = xalpha.invert(pt[0])
          var beta  = ybeta.invert(pt[1])  	

          xAxis.select("circle").attr("cx", pt[0])      
          yAxis.select("circle").attr("cy", pt[1])
          
          var e = getEigs(alpha,beta, 100)
          var n1 = 0
          var n2 = 0
          var regime = ""
          var regime2 = "convergent"
          if (e.y === undefined) {
            n1 = Math.abs(e.x[0])
            n2 = Math.abs(e.x[1])
            regime = "real"
          } else {
            n1 = numeric.norm2(e.x[0], e.y[0])    
            n2 = numeric.norm2(e.x[1], e.y[1]) 
            regime = "complex"               
          }

          if (Math.max(n1,n2) < 1) {
            regime2 = "convergent"
          } else {
            regime2 = "divergent"
          }

          if (alpha < 1/100) {
            regime3 = "short"
          } else if (alpha < 2/100) {
            regime3 = "long"
          } else {
            regime3 = "verylong"
          }

          if (regime == "real" && regime3 == "long") {
            updateMO(alpha,beta)
          }

          if (regime == "real" && regime3 == "short") {
            updateMC(alpha,beta)
          }

          if (regime == "complex" && (regime3 == "short" || regime3=="long")) {
            updateDR(alpha,beta)
          }

          if (regime2 == "divergent") {
            updateD(alpha,beta)
          }

          if (regime2 == "convergent" && regime3 == "verylong") {
            updateDD(alpha,beta)
          }

          var divwidth = div.node().getBoundingClientRect().width;
          var divheight = div.node().getBoundingClientRect().height;        
          div.style("left", (pt[0] + slider2Dleft - divwidth/2) + "px")
          div.style("top", (pt[1] + slider2Dtop - divheight - 6) + "px")
          
          div.html("s1 =" + round(n1) + 
                   "<br>s2 =" + round(n2) + "<br> " + regime + " " + regime2 + " " + regime3)
          div.style("opacity",1)  
        })
        .on("mouseout", function() {
          div.style("opacity",0)
        })
        .node();

    renderHeatmap(canvas, function(i,j) { 
      var e = getEigs(4*i,1-j, 1)
      return Math.max(e.getRow(0).norm2(), e.getRow(1).norm2()); 
    }, d3.scaleLinear().domain([0,0.3,0.5,0.7,1]).range(colorbrewer.Spectral[5]))

    // /* Axis */
    var canvasaxis = divin.append("svg").style("z-index", 0)
      .style("position","absolute")
      .style("left",slider2Dleft - 50)
      .style("top", (slider2Dtop - 20) + "px")
      .style("width",2*slider2D_size + 70)
      .style("height",slider2D_size + 60)

    var xAxis = canvasaxis.append("g")
    xAxis.append("circle").attr("fill", "black").attr("r", 2)
    xAxis.attr("class", "grid")
      .attr("transform", "translate(51,"+(slider2D_size + 25) +")")  
      .call(d3.axisBottom(d3.scaleLinear().domain([0,4]).range([0, 2*slider2D_size]))
          .ticks(2)
          .tickSize(4))

    var yAxis = canvasaxis.append("g")
    yAxis.append("circle").style("fill", "black").attr("r", 2)
    yAxis.attr("class", "grid")
      .attr("transform", "translate(46,20)")
      .call(d3.axisLeft(ybeta).ticks(1).tickSize(4))


  }

  render2DSlider.margin = function (_1, _2) {
    slider2Dtop = _1; slider2Dleft = _2; return render2DSlider
  }

  render2DSlider.size = function (_) {
    slider2D_size = _; return render2DSlider
  }

  return render2DSlider
}