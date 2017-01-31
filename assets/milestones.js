function renderMilestones(div, updateTick) {
  var lambda = [1,10,100]
  var totalIters = 150

  var f = function(x) { 
    var fx = 0.5*(lambda[0]*x[0]*x[0] + lambda[1]*x[1]*x[1] + lambda[2]*x[2]*x[2])
    var g  = [lambda[0]*x[0], lambda[1]*x[1], lambda[2]*x[2]]
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
    var w0 = [1,1/Math.sqrt(lambda[1]),1/Math.sqrt(lambda[2])]
    var v = runMomentum(f, w0, alpha, beta, totalIters)
    var fxstack = []
    // Add contributions to the objective
    for (var i = 0; i < v[0].length; i++) {
      var x = v[1][i]
      fxstack.push([lambda[0]*x[0]*x[0]/2, lambda[1]*x[1]*x[1]/2, lambda[2]*x[2]*x[2]/2 ])
    }
    v.push(fxstack)
    return v
  }

  var update = stackedBarchartGen(totalIters, 3)(div) 

  var updateStep = function(alpha, beta) {
    var trace = getTrace(alpha/lambda[2], beta)
    update(trace[2]) 
    // Update the milestones on the slider
    var milestones = [0,0,0]
    for (var i = 0; i < trace[1].length; i++) {
      if (trace[1][i][0] > 0.06) {  milestones[2] = i }
      if (trace[1][i][1] > 0.06) {  milestones[1] = i }
      if (trace[1][i][2] > 0.06) {  milestones[0] = i }
    }
    updateTick(milestones) 
  }

  updateStep(0.5, 0)

  return updateStep
}