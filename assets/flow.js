function renderFlowWidget(divin) {

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
  var iter = geniter(FlowU, FlowSigma, b, 2/8)
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
        .style("border", "black solid 1px")
        .style("box-shadow","0px 3px 10px rgba(0, 0, 0, 0.4)")

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
    display2(FlowU[i], divergent)
  }

  var onDragSlider = function (i, handle) {
    var i = Math.floor(Math.exp(i)) 
    display(iter(i), jetc)
    handle.select("text").text("k=" + i )
    //+ Math.round(100*((0.4*i)/100)/60)/100
  }

  // Generate Slider in the middle

  var slider = sliderGen([920, 60])
            .ticks(getStepsConvergence(FlowSigma,2/8).map(function(i) {return Math.log(i) + 1}))
            .change(onDragSlider)
            .mouseover(showEigen)
            .startxval(2)
            .tickConfig(1.5,5,true)           
            .tooltip( function(d) { return "λ<sub>"+(d+1)+"</sub> = " + round(FlowSigma[d]) + "<br>x<sub>" + (d+1) + "</sub><sup style=\"position:relative; left:-5px\">0</sup> = " + round(Ub[d]) })

  slider(divin)

  display(iter(100), jetc) // Set it up to a nice looking default

  // Generate Display at the bottom

  var display2 = renderGrid(divin, 100)

  display2(FlowU[21], divergent) // Set it up to a nice looking default

  // Display labels!

  divin.append("span")
    .style("position","absolute")
    .style("top", "202px")
    .style("left", "0px")
    .style("font-size", "12px")
    .style("text-align", "center")
    .html("Eigenvectors")

  divin.append("span")
    .style("position","absolute")
    .style("top", "-25px")
    .style("left", "0px")
    .style("font-size", "12px")
    .style("text-align", "center")
    .html("w<sub>i</sub>")
    
}

