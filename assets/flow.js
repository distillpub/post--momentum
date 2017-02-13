function renderFlowWidget(divin) {


  divin.append("figcaption")
       .style("position", "absolute")
       .style("left", "500px")
       .style("width", "300px")
       .html("Each square in the graph below represents a node (and a weight $w_i$), and edges connect neighboring squares. Drag the slider to see the progress of gradient descent.")
  

  var stepCaption = divin.append("figcaption")
       .style("position", "absolute")
       .style("left", "153px")
       .style("width", "300px")
       .attr("class", "figtext")
       .html("Step size α = 0.02")
  

  sliderGen([320, 100])
      .ticks([0,2/FlowSigma[1119]])
      .cRadius(5)
      .startxval(4)
      .shifty(-20)
      .change(changeStep)(divin.append("div").style("position","relative").style("left", "100px"))

  /*
  Generate coordinates for 2D Laplacian based on input matrix
  V[i] = (x,y) coordinate of node in 2D space.
  */
  var V = []
  for (var i = 0; i < 16; i++) { for (var j = 0; j < 112; j++) {
    if (M[i][j] == 0){ V.push([j,i]) }
  }}

  /* Generate b in optimization problem x'Ax - b'x */
  var b = zeros(FlowU[0].length); b[448] = 10;  b[560] = 10
  var step = 1.9/(FlowSigma[1119])
  var iter = geniter(FlowU, FlowSigma, b, step)
  var Ub = numeric.dot(FlowU, b)

  // We can also run this on momentum. 
  //var iterf = geniterMomentum(U, FlowSigma, b, 2/8, 1)
  //var iter = function(k) { return iterf(k)[1] }

  /**************************************************************************
    START VISUALIZATION 
  ***************************************************************************/

  divin.style("position", "relative")

  /* Render the 2D grid of pixels, given a div as input
   * (appends an svg inside the div)
   * Returns a function which allows you to update it */
  function renderGrid(s, transition) {

    var sampleSVG = s.style("display", "block")
      .style("margin-left","auto")
      .style("margin-right","auto")
      .style("width", "920px")
        .append("svg")
        .attr("width", 920)
        .attr("height", 150)   

    /* Render discretization of 2D Laplacian*/
    sampleSVG.selectAll("rect")
        .data(V)
        .enter().append("rect")
        .style("fill", function(d,i) { return "white" })
        .attr("height", 7.7)
        .attr("width", 7.7)
        .attr("x", function(d, i){return d[0]*8+ 10})
        .attr("y", function(d, i){return d[1]*8 + 10})

    /* display a function on the laplacian using colormap map*/
    var display = function (x, map) {
      if (transition === undefined){
        sampleSVG.selectAll("rect").style("fill", function(d,i) { return map(x[i]) })
      } else {
        sampleSVG.transition()
          .duration(transition)
          .selectAll("rect")
          .style("fill", function(d,i) { return map(x[i]) })      
      }
    }

    return display

  }

  var display = renderGrid(divin)
  /* Render Control Slider */

  // Callbacks
  var showEigen = function (d,i) {
    display(FlowU[i], divergent)
  }

  var onDragSlider = function (i) {
    var i = Math.floor(Math.exp(i)) 
    display(iter(i), jetc)
  }

  display(iter(100), jetc) // Set it up to a nice looking default

  var barLengths = getStepsConvergence(FlowSigma,step)
    .map( function(i) {return Math.log(i+1)} ).filter( function(d,i) { return (i < 50) || i%20 == 0 } )

  var slideControl = sliderBarGen(barLengths)
                    .height(281)
                    .linewidth(1.3)
                    .maxX(13.3)
                    .mouseover( function(d,i) { console.log(i); display(FlowU[i], divergent) })
                    .labelFunc(function (d,i) { 
                      if (i < 50) {
                        return ((i == 0) ? "Eigenvalue 1" : "") + (( (i+1) % 25 == 0 ) ? (i + 1) : "") 
                      } else {
                        return (( (i+1) % 25 == 0 ) ? 20*(i + 1) : "") 
                      }
                    })
                    .update(onDragSlider)(divin)

  slideControl.slidera.init()

  function changeStep(step) {
    var barLengths = getStepsConvergence(FlowSigma,Math.max(step,0.000001))
      .map( function(i) {return Math.log(Math.max(i,1))} ).filter( function(d,i) { return (i < 50) || i%20 == 0 } )
    slideControl.update(barLengths)
    iter = geniter(FlowU, FlowSigma, b, Math.max(step, 0.000001))
    slideControl.slidera.init()
    stepCaption.html("Step size α = " + step.toPrecision(3))
  }
    
}

