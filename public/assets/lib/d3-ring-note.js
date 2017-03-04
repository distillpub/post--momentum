d3.ringNote = function() {
  var draggable = false,
      controlRadius = 15;
  
  var dragCenter = d3.behavior.drag()
    .origin(function(d) { return { x: 0, y: 0}; })
    .on("drag", dragmoveCenter);
  
  var dragRadius = d3.behavior.drag()
    .origin(function(d) { return { x: 0, y: 0 }; })
    .on("drag", dragmoveRadius);
  
  var dragText = d3.behavior.drag()
    .origin(function(d) { return { x: 0, y: 0 }; })
    .on("drag", dragmoveText);
  
  var path = d3.svg.line();
  
  function draw(selection, annotation) {
    
    selection.selectAll(".ring-note").remove();
    
    var gRingNote = selection.selectAll(".ring-note")
        .data(annotation)
      .enter().append("g")
        .attr("class", "ring-note")
        .attr("transform", function(d) {
          return "translate(" + d.cx + "," + d.cy + ")";
        });
    
    var gAnnotation = gRingNote.append("g")
      .attr("class", "annotation");
    
    var circle = gAnnotation.append("circle")
      .attr("r", function(d) { return d.r; });
    
    var line = gAnnotation.append("path")
      .call(updateLine);
      
    var text = gAnnotation.append("text")
      .call(updateText);
    
    if (draggable) {
      
      var gControls = gRingNote.append("g")
        .attr("class", "controls");
      
      // Draggable circle that moves the circle's location
      var center = gControls.append("circle")
        .attr("class", "center")
        .call(styleControl)
        .call(dragCenter);
      
      // Draggable circle that changes the circle's radius
      var radius = gControls.append("circle")
        .attr("class", "radius")
        .attr("cx", function(d) { return d.r; })
        .call(styleControl)
        .call(dragRadius); 
       
      // Make text draggble
      text
        .style("cursor", "move")
        .call(dragText);
    }
    
    return dragmoveCenter;
  }
  
  draw.draggable = function(_) {
    if (!arguments.length) return draggable;
    draggable = _;
    return draw;
  };
  
  // Region in relation to circle, e.g., N, NW, W, SW, etc.
  function getRegion(x, y, r) {
    var px = r * Math.cos(Math.PI/4),
        py = r * Math.sin(Math.PI/4);
    
    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    
    if (distance < r) {
      return null;
    }
    else {
      if (x > px) {
        // East
        if (y > py) return "SE"; 
        if (y < -py) return "NE";
        if (x > r) return "E";
        return null;
      }
      else if (x < -px) {
        // West
        if (y > py) return "SW";
        if (y < -py) return "NW";
        if (x < -r) return "W";
        return null;
      }
      else {
        // Center
        if (y > r) return "S";
        if (y < -r) return "N";
      }
    }
  }
  
  function dragmoveCenter(d) {
    var gRingNote = d3.select(this.parentNode.parentNode);
        
    d.cx += d3.event.x;
    d.cy += d3.event.y;
    
    gRingNote
      .attr("transform", function(d) {
        return "translate(" + d.cx + "," + d.cy + ")";
      });
  }
  
  function dragmoveRadius(d) {
    var gRingNote = d3.select(this.parentNode.parentNode),
        gAnnotation = gRingNote.select(".annotation"),
        circle = gAnnotation.select("circle"),
        line = gAnnotation.select("path"),
        text = gAnnotation.select("text"),
        radius = d3.select(this);
    
    d.r += d3.event.dx;
    
    circle.attr("r", function(d) { return d.r; });
    radius.attr("cx", function(d) { return d.r; });
    line.call(updateLine);
    text.call(updateText);
  }
  
  function dragmoveText(d) {
    var gAnnotation = d3.select(this.parentNode),
        line = gAnnotation.select("path"),
        text = d3.select(this);
    
    d.textOffset[0] += d3.event.dx;
    d.textOffset[1] += d3.event.dy;
    
    text.call(updateText);
    line.call(updateLine);
  }
  
  function updateLine(selection) {
    return selection.attr("d", function(d) {
      var x = d.textOffset[0],
          y = d.textOffset[1],
          lineData = getLineData(x, y, d.r);
      return path(lineData);
    });
  }
  
  function getLineData(x, y, r) {
    var region = getRegion(x, y, r);
    
    if (region == null) {
      // No line if text is inside the circle
      return [];
    }
    else {
      // Cardinal directions
      if (region == "N") return [[0, -r], [0, y]];
      if (region == "E") return [[r, 0], [x, 0]];
      if (region == "S") return [[0, r], [0, y]];
      if (region == "W") return [[-r, 0],[x, 0]];
      
      var d0 = r * Math.cos(Math.PI/4),
          d1 = Math.min(Math.abs(x), Math.abs(y)) - d0;
          
      // Intermediate directions
      if (region == "NE") return [[ d0, -d0], [ d0 + d1, -d0 - d1], [x, y]];
      if (region == "SE") return [[ d0,  d0], [ d0 + d1,  d0 + d1], [x, y]];
      if (region == "SW") return [[-d0,  d0], [-d0 - d1,  d0 + d1], [x, y]];
      if (region == "NW") return [[-d0, -d0], [-d0 - d1, -d0 - d1], [x, y]];
    }
  }
  
  function updateText(selection) {
    return selection.each(function(d) {
      var x = d.textOffset[0],
          y = d.textOffset[1],
          region = getRegion(x, y, d.r),
          textCoords = getTextCoords(x, y, region);
      
      d3.select(this)
        .attr("x", textCoords.x)
        .attr("y", textCoords.y)
        .text(d.text)
        .each(function(d) {
          var x = d.textOffset[0],
              y = d.textOffset[1],
              textAnchor = getTextAnchor(x, y, region);
          
          var dx = textAnchor == "start" ? "0.33em" :
                  textAnchor == "end" ? "-0.33em" : "0";
          
          var dy = textAnchor !== "middle" ? ".33em" :
            ["NW", "N", "NE"].indexOf(region) !== -1 ? "-.33em" : "1em";
          
          var orientation = textAnchor !== "middle" ? undefined :
            ["NW", "N", "NE"].indexOf(region) !== -1 ? "bottom" : "top";
          
          d3.select(this)
            .style("text-anchor", textAnchor)
            .attr("dx", dx)
            .attr("dy", dy)
            .call(wrapText, d.textWidth || 960, orientation);
        });
    });
  }
  
  function getTextCoords(x, y, region) {
    if (region == "N") return { x: 0, y: y };
    if (region == "E") return { x: x, y: 0 };
    if (region == "S") return { x: 0, y: y };
    if (region == "W") return { x: x, y: 0 };
    return { x: x, y: y };
  }
  
  function getTextAnchor(x, y, region) {
    if (region == null) {
      return "middle";
    }
    else {
      // Cardinal directions
      if (region == "N") return "middle";
      if (region == "E") return "start";
      if (region == "S") return "middle";
      if (region == "W") return "end";
      
      var xLonger = Math.abs(x) > Math.abs(y);
      
      // Intermediate directions`
      if (region == "NE") return xLonger ? "start" : "middle";
      if (region == "SE") return xLonger ? "start" : "middle";
      if (region == "SW") return xLonger ? "end" : "middle";
      if (region == "NW") return xLonger ? "end" : "middle"; 
    }
  }
  
  // Adapted from: https://bl.ocks.org/mbostock/7555321
  function wrapText(text, width, orientation) {
    text.each(function(d) {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 1,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          dx = text.attr("dx"),
          tspan = text.text(null).append("tspan").attr("x", x).attr("dx", dx);
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", x)
            .attr("dx", dx)
            .attr("dy", lineHeight + "em")
            .text(word);
          lineNumber++;
        }
      }
      
      var dy;
      if (orientation == "bottom") { 
        dy = -lineHeight * (lineNumber-1) - .33; 
      }
      else if (orientation == "top") { 
        dy = 1;
      }
      else { 
        dy = -lineHeight * ((lineNumber-1) / 2) + .33; 
      }
      text.attr("dy", dy + "em");
      
    });
  }
  
  function styleControl(selection) {
    selection
      .attr("r", controlRadius)
      .style("fill-opacity", "0")
      .style("stroke", "black")
      .style("stroke-dasharray", "3, 3")
      .style("cursor", "move");
  }
  
  return draw;
};