function phaseDiagram_dec(divin) {

  var totalIters = 250
  var default_underdamp = 0.97
  var default_overdamp = 0.05

  function myRunMomentum(f, w0, alpha, beta, totalIters) {
    var W = []; var Z = []; var z = zeros(w0.length); var w = w0
    z[1] = 1
    var gx = f(w0);
    W.push(w0); 
    Z.push(numeric.mul(-1,z));
    for (var i = 0; i < totalIters; i++) {
      var z = numeric.add(numeric.mul(beta, z), gx)
      var w = numeric.add(w, numeric.mul(-alpha, z))
      gx = f(w); 
      if (w.every(isFinite)) {
        W.push(w)
        Z.push(numeric.mul(-1, z))
      } else{ break; }
    }
    return [Z,W]
  }

  function getTrace(alpha, beta, lambda) {
    var m = []
    var iter = myRunMomentum(function(x) { return [x[0],lambda*x[1]] }, [2,0.92], alpha, beta, totalIters) 
    // run for 500 iterations
    for (var i = 0; i <= totalIters; i++) { 
      var x = -1*iter[1][i][1]
      var y = (1.4)*iter[0][i][1]
      m.push([y, x])
    }
    mG = m
    return m
  }

  var al = 0.0001
  var optbeta = Math.pow(1 - Math.sqrt(al*100),2)

  var w = 110
  var h = 110
  var a = 1.0

  var axis = [[-a*5,a*5],[-a,a]]
  var width_bar = 620
  var X = d3.scaleLinear().domain([0,1]).range([0, width_bar])

  var valueline = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

  var overlay = divin.append("svg")
       .style("position", "absolute")
       .attr("width", 348)
       .attr("height", 520)
       .style("z-index", 10)
       .style("pointer-events", "none")

  // Draw the three phases

  var lambdas = [0, 0.011, 0.25]
  var betas = [1, 0.985, 0.95, 0.8, 0]

  for (var i = 0; i < 5; i ++ ) {
    divin.append("figcaption")
      .style("position","absolute")
      .style("width",(w-10) + "px")
      .style("height",20 + "px")
      .style("left", 70+135*i + "px")
      .style("top", 0 + "px")
      .attr("class", "figtext")
      .style("border-bottom", "1px solid black" )
      .html((i != 0 ? "" : "β = ") + betas[i])
  }

  for (var j = 0; j < 3; j ++ ) {
    divin.append("figcaption")
      .style("position","absolute")
      .style("width",35 + "px")
      .style("height",h + "px")
      .style("left", 0 + "px")
      .style("top", 50+150*j + "px")
      .attr("class", "figtext")      
      .style("border-right", "1px solid black" )
      .html( (j != 0 ? "" : "<br>λ = ") + lambdas[j])
  }

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",35 + "px")
    .style("height",h + "px")
    .style("left", 94 + "px")
    .style("top", 27 + "px")
    .html( "Velocity")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",100 + "px")
    .style("height",h + "px")
    .style("left", 70 + "px")
    .style("top", -17 + "px")
    .attr("class", "figtext")
    .html( "Damping")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",100 + "px")
    .style("height",h + "px")
    .style("left", -55 + "px")
    .style("top", 50 + "px")
    .attr("class", "figtext")
    .html( "External Force")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",35 + "px")
    .style("height",h + "px")
    .style("left", 80 + "px")
    .style("top", 56 + "px")
    .style("transform","rotate(-90deg)")
    .html( "Position")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",160 + "px")
    .style("height",h + "px")
    .style("left", 730 + "px")
    .style("top", 40 + "px")
    .style("font-size", "12px")
    .html("When $\\lambda_i = 0$ and $\\beta=1$, the object moves at constant speed. As $\\beta$ goes down, the particle decelerates, losing a proportion of its energy at each tick. ")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",160 + "px")
    .style("height",h + "px")
    .style("left", 730 + "px")
    .style("top", (150 + 45) + "px")
    .style("font-size", "12px")
    .html("Here the velocity is modiﬁed by an external force field. This force field varies in proportion to the particle’s distance from $0$, and moves in a periodic trajectory.")

  divin.append("figcaption")
    .style("position","absolute")
    .style("width",160 + "px")
    .style("height",h + "px")
    .style("left", 730 + "px")
    .style("top", (150*2 + 50) + "px")
    .style("font-size", "12px")
    .html("Combining damping and the force field, the particle behaves like a damped harmonic oscillator, returning lazily to equlibrium.")

  for (var i = 0; i < 5; i ++ ) {
    for (var j = 0; j < 3; j ++) {
      var div = divin.append("div")
        .style("position","absolute")
        .style("width", w + "px")
        .style("height",h + "px")
        .style("left", 65+135*i + "px")
        .style("top", 50+150*j + "px")

      var svg = div.append("svg")
                  .style("position", 'absolute')
                  .style("left", 0)
                  .style("top", "0px")
                  .style("width", w)
                  .style("height", h)
        .style("border-radius", "5px")

      svg.append("g").attr("class", "grid")
        .attr("transform", "translate(0," + h/2 +")")
        .attr("opacity", 0.2)
        .call(d3.axisBottom(X).ticks(0).tickSize(0))

      svg.append("g").attr("class", "grid")
        .attr("transform", "translate(" + w/2 + ",0)")
        .attr("opacity", 0.2)      
        .call(d3.axisLeft(X).ticks(0).tickSize(0))

      var colorRange = d3.scaleLinear().domain([0, 10, 50, totalIters]).range(colorbrewer.OrRd[4])
      
      var Xaxis = d3.scaleLinear().domain(axis[0]).range([0, w])
      var Yaxis = d3.scaleLinear().domain(axis[1]).range([0, h])

      var update = plot2dGen(Xaxis, Yaxis, colorRange)
                    .pathOpacity(1)
                    .pathWidth(0.5)
                    .circleRadius(1) 
                    .stroke(colorbrewer.OrRd[5][2])(svg)

      update(getTrace(0.02, betas[i], lambdas[j]))
    }
  }



}