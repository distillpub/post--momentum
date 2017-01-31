/*
  Make a standard "path of descent" plot which shows iterates
  on a 2D optimization landscape

  Takes in : f, the objective function
             Name of div where the graphic is rendered
             update, which gets passed in the objective 
             values at every iteration

  Returns : callback `changeParams` to change alpha, beta
*/
function genIterDiagram(f, xstar, axis) {

  /*
    Configurable Parameters
  */
  var w = 900
  var h = 300
  var totalIters = 150
  var state_beta = 0.0
  var state_alpha = 0.001
  var num_contours = 15
  var onDrag = function() {}
  var w0 =[-1.21, 0.853]

  function renderIterates(div) {

    // Render the other stuff
    var intDiv = div.style("width", w + "px")
      .style("height", h + "px")
      .style("box-shadow","0px 3px 10px rgba(0, 0, 0, 0.4)")
      .style("border", "solid black 1px")

    // Render Contours 
    var plotCon = contour_plot.ContourPlot(w,h)
        .f(function(x,y) { return f([x,y])[0] })
        .drawAxis(false)
        .xDomain(axis[0])
        .yDomain(axis[1])
        .contourCount(num_contours)
        .minima([{x:xstar[0], y:xstar[1]}]);

    var elements = plotCon(intDiv);

    var svg = intDiv.append("div")
      .append("svg")
        .style("position", 'absolute')
        .style("left", 0)
        .style("top", 0)
        .style("width", w)
        .style("height", h)
        .style("z-index", 2) 

    var X = d3.scaleLinear().domain(axis[0]).range([0, w])
    var Y = d3.scaleLinear().domain(axis[1]).range([0, h])
      
    // Rendeer Draggable dot
    var circ = svg.append("circle")
      .attr("cx", X(w0[0])) 
      .attr("cy", Y(w0[1]) )
      .attr("r", 4)
      .style("cursor", "pointer")
      .attr("fill", colorbrewer.OrRd[3][1])
      .attr("opacity", 0.8)
      .attr("stroke-width", 1)
      .attr("stroke", colorbrewer.OrRd[3][2])
      .call(d3.drag().on("drag", function() {
        var pt = d3.mouse(this)
        var x = X.invert(pt[0])
        var y = Y.invert(pt[1])
        this.setAttribute("cx", pt[0])
        this.setAttribute("cy", pt[1])
        w0 = [x,y]
        onDrag(w0)
        iter(state_alpha, state_beta, w0);
      }))

    var iterColor = d3.scaleLinear().domain([0, totalIters]).range(["black", "black"])

    var update2D = plot2dGen(X, Y, iterColor)(svg)

    // Append x^star
    svg.append("path")
      .attr("transform", "translate(" + X(xstar[0]) + "," + Y(xstar[1]) + ")")
      .attr("d", "M 0.000 2.000 L 2.939 4.045 L 1.902 0.618 L 4.755 -1.545 L 1.176 -1.618 L 0.000 -5.000 L -1.176 -1.618 L -4.755 -1.545 L -1.902 0.618 L -2.939 4.045 L 0.000 2.000")
      .style("fill", "white")
      .style("stroke-width",1)
      
    function iter(alpha, beta, w0) {

      // Update Internal state of alpha and beta
      state_alpha = alpha
      state_beta  = beta

      // Generate iterates 
      var OW = runMomentum(f, w0, alpha, beta, totalIters)
      var W = OW[1]

      update2D(W)

      circ.attr("cx",  X(w0[0]) ).attr("cy", Y(w0[1]) )
      circ.moveToFront()

    }

    iter(state_alpha, state_beta, w0);
    
    return { control:iter, 
             w0:function() { return w0 }, 
             alpha:function() { return state_alpha }, 
             beta:function() {return state_beta} }

  }

  renderIterates.width = function (_) {
    w = _; return renderIterates;
  }

  renderIterates.height = function (_) {
    h = _; return renderIterates;
  }

  renderIterates.iters = function (_) {
    totalIters = _; return renderIterates;
  }

  renderIterates.drag = function (_) {
    onDrag = _; return renderIterates;
  }

  renderIterates.init = function (_) {
    w0 = _; return renderIterates;
  }

  renderIterates.alpha = function (_) {
    state_alpha = _; return renderIterates;
  }

  renderIterates.beta = function (_) {
    state_beta = _; return renderIterates;
  }

  return renderIterates

}
