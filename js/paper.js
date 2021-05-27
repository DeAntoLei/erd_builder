var graph = new joint.dia.Graph({
    cellViewNamespace: joint.shapes,
  }),
  paper = new joint.dia.Paper({
    el: $("#paper-canvas"),
    model: graph,
    restrictTranslate: true,
    width: $("#paper-canvas").width(),
    height: $("#paper-canvas").height(),
    background: { color: "#fff" },
    interactive: { vertexAdd: false },
    cellViewNamespace: joint.shapes,
    preventContextMenu: false 
  });

var graph_states = [];
var grid_states = [];
var currentState;
var showGrid = null;
// LOCALSTORAGE-HANDLING
checkGraphLocalStorageItem();
addState();
if (showGrid === null) showGrid = false;

var link;
var finalLink;
var drawLine = false;
var startingElem = null;

var isaElements = [];

function createLink(elementView) {
  if (!drawLine) {
    startingElem = elementView.model.id;
    drawLine = true;
    link = new joint.shapes.standard.Link({
      attrs: {
        line: {
            connection: true,
            stroke: 'orchid',
            strokeWidth: 1.5,
            strokeLinejoin: 'round',
            targetMarker: 'none'
        },
        wrapper: {
            connection: true,
            strokeWidth: 10,
            strokeLinejoin: 'round'
        },
      }
    });
    link.addTo(graph);
  }

  var currentElement = elementView.model;
  currentElement.attr("body/stroke", "orange");

  var linked =
    startingElem != currentElement.id
      ? graph.isNeighbor(
          graph.getCell(startingElem),
          currentElement
        )
      : false;

  if (startingElem != currentElement.id && !linked) {
    const startingElement = graph.getCell(startingElem);
    finalLink = link.clone();
    finalLink.target({ id: currentElement.id });
    link.remove();

    // should proceed with link?
    if (!connectionAllowed(startingElement, currentElement)) {
      abortLink();
      return;
    }
    
    // Proceed with link, but aggregation or ISA involved?
    if (isTypeInvolved(startingElement, currentElement, 'tm.Aggregation')) {
      $("#query_modal").prependTo("body");
      $('#query_modal').modal({ show: true, backdrop: 'static' });
      $("#query_modal_text").html('Add to aggregation?');
    } else if (isTypeInvolved(startingElement, currentElement, 'tm.ISA')) {
      $("#query_modal").prependTo("body");
      $('#query_modal').modal({ show: true, backdrop: 'static' });
      $("#query_modal_text").html('Superclass?');
    }

    // should include label?
    const inclLabel = includeLabel(startingElement, currentElement);
    if (inclLabel) { finalLink.appendLabel({ position: 0.8, attrs: { text: { fill: "orchid", text: "N" } } }); }
    // fix label position when relationships are involved
    if (finalLink.prop('labels') && ['tm.Relationship', 'tm.Identifying_Relationship', 'tm.Aggregation'].includes(startingElement.prop("type"))) {
      finalLink.label(0, { position: 0.2 });
    }
    // is connection with weak entity?
    if (connectionBetween(startingElement, currentElement, 'tm.Weak_Entity', 'tm.Identifying_Relationship')) {    
      finalLink.attr('line/strokeWidth', 3);
      finalLink.label(0, { attrs: { text: { fill: "orchid", text: '1' } } });
    }
    finalLink.addTo(graph);

    $('#yesButton').click(() => {
      if ($('#query_modal_text').html().includes('aggregation')) { 
        finalLink.attr('line/stroke', 'indigo');
        finalLink.label(0, { attrs: { text: { fill: "indigo", text: "N" } } });
      } else { finalLink.appendLabel({ position: 0.8, attrs: { text: { fill: "orchid", text: "Superclass" } } }); }
      addState();
    })
    
    startingElem = null;
    drawLine = false;
    addState();
  }

  if (linked) {
    link.remove();
    startingElem = null;
    drawLine = false;
  }
}

function connectionAllowed(starting, current) {
  let connectionAllowed = true;
  if (starting.prop('type') === current.prop('type') ||
    (starting.markup.includes('ellipse') && current.markup.includes('ellipse')) ||
    isTypeInvolved(starting, current, 'tm.ISA') && !connectionBetween(starting, current, 'tm.ISA', 'tm.Entity') || 
    isTypeInvolved(starting, current, 'tm.Relationship') && (connectionBetween(starting, current, 'tm.Relationship', 'tm.Weak_Entity') || 
    connectionBetween(starting, current, 'tm.Relationship', 'tm.Identifying_Relationship')) ||
    isTypeInvolved(starting, current, 'tm.Entity') && connectionBetween(starting, current, 'tm.Entity', 'tm.Weak_Entity')) {  
    connectionAllowed = !connectionAllowed;
  }
  
  if (!connectionAllowed) {
    showAlert('warning', 'warn-conn-not-allowed', `Connection between ${starting.prop('type').substring(3).toUpperCase().bold()} and 
      ${current.prop('type').substring(3).toUpperCase().bold()} elements cannot be established..`);
  }
  return connectionAllowed;
}

function isTypeInvolved(starting, current, type) {
  return starting.prop("type") === type  || current.prop("type") === type;
}

function includeLabel(starting, current) {
  const typesWithoutLabel = ["tm.Normal", "tm.Key", "tm.Multivalued", "tm.Derived", "tm.ISA"];
  return (typesWithoutLabel.includes(starting.prop('type')) || typesWithoutLabel.includes(current.prop('type'))) ? false : true;
}

function connectionBetween(starting, current, type1, type2) {
  const startingType = starting.prop('type');
  const currentType = current.prop('type');
  if ((startingType === type1 && currentType === type2) || (currentType === type1 && startingType === type2)) {
    return true;
  }
  return false;
}

// remove link blueprint when blank is clicked or esc is pressed
function abortLink() {
  if (drawLine) {
    link.remove();
    drawLine = false;
    startingElem = null;
  }
}

// Finish linking 2 elements by pointing the cursor down as an alternative to clicking the Create Link button
paper.on("element:pointerdown", (elementView, evt) => {
  if (startingElem) {
    createLink(elementView);
  }
});

paper.$el.on("pointermove", function (evt) {
  if (drawLine) {
    link.source({ id: startingElem }); 

    // Get source - target point
    var linkView = link.findView(paper)
    // Adjust target point with regard to scaling
    var p = paper.clientToLocalPoint({ x: evt.clientX, y: evt.clientY }); 
    
    // Compute the angle of the line between source - target point
    var angle =  (Math.atan2(p.y - linkView.sourcePoint.y, p.x - linkView.sourcePoint.x) * 180) / Math.PI;
    angle = angle * Math.PI / 180;

    // Change the target of the link based on the computed angle
    link.target({ x: p.x - 10*Math.cos(angle), y: p.y - 10*Math.sin(angle) });
  }
})

// Add tools to the links
paper.on("link:mouseenter", function (linkView) {
  paper.removeTools();
  var verticesTool = new joint.linkTools.Vertices();
  var segmentsTool = new joint.linkTools.Segments();
  var sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
  var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
  var sourceAnchorTool = new joint.linkTools.SourceAnchor();
  var targetAnchorTool = new joint.linkTools.TargetAnchor();
  var boundaryTool = new joint.linkTools.Boundary();
  var removeButton = new joint.linkTools.Remove({
    markup: [
      { tagName: "circle", selector: "button", attributes: { r: 7, fill: "#fff", stroke: "red", cursor: "pointer" } },
      { tagName: "path", selector: "icon",
        attributes: {
          d: "M -3 -3 3 3 M -3 3 3 -3",
          fill: "none", stroke: "red", "stroke-width": 2, "pointer-events": "none"
        }
      }
    ],
    action: (evt, linkView, toolView) => {
      var retrVal = confirm("Are you sure you want to delete the link?");
      if (retrVal) {
        linkView.model.remove();
        addState();
      }
    }
  });
  var infoTool = new joint.linkTools.Button({
    markup: [
      { tagName: "circle", selector: "button", attributes: { r: 7, fill: "#fff", stroke: "#001DFF", cursor: "pointer" } },
      { tagName: "path", selector: "icon",
        attributes: {
          d: "M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4",
          fill: "none", stroke: "#001DFF", "stroke-width": 2, "pointer-events": "none"
        }
      }
    ],
    distance: 80,
    offset: 0,
    action: function (evt) { showHelpbox(linkView.model); }
  });

  var toolsView = new joint.dia.ToolsView({
    tools: [
      verticesTool,
      segmentsTool,
      sourceArrowheadTool,
      targetArrowheadTool,
      sourceAnchorTool,
      targetAnchorTool,
      boundaryTool,
      removeButton,
      infoTool,
    ],
  });
  linkView.addTools(toolsView);
  linkView.showTools();
});

paper.on("link:mouseleave", function (linkView) {
  linkView.hideTools();
});

paper.on("element:pointerdblclick", function (cellView) {
  showHelpbox(cellView.model);
});

paper.$el.on("mousewheel DOMMouseScroll", function (evt) {
  evt.preventDefault();
  evt = evt.originalEvent;

  var delta = Math.max(-1, Math.min(1, evt.wheelDelta || -evt.detail)) / 50;
  var offsetX = evt.offsetX || evt.clientX - $(this).offset().left; // offsetX is not defined in FF
  var offsetY = evt.offsetY || evt.clientY - $(this).offset().top; // offsetY is not defined in FF
  var p = offsetToLocalPoint(offsetX, offsetY);
  var newScale = V(paper.viewport).scale().sx + delta; // the current paper scale changed by delta
  i = V(paper.viewport).scale().sx + delta;

  if (newScale > 0.4 && newScale < 2) {
    paper.setOrigin(0, 0); // reset the previous viewport translation
    paper.scale(newScale, newScale, p.x, p.y);
  }
});

document.getElementById("file-upload").addEventListener("change", function (e) {
  var x = null;
  var fr = new FileReader();
  fr.onload = function () {
    x = fr.result;
    graph.fromJSON(JSON.parse(x));

    resetStates();

    document.getElementById("filename").innerHTML = e.target.value.split('\\').pop();
    document.getElementById("dismiss-btn").style.display = "block";
    enableButtons('save', true);
    document.getElementById("nav_close").classList.remove('disabled');

    // Disable buttons
    disableButtons('undo', true);
    disableButtons('redo', true);
  };

  fr.readAsText(this.files[0]);
});

function offsetToLocalPoint(x, y) {
  var svgPoint = paper.svg.createSVGPoint();
  svgPoint.x = x;
  svgPoint.y = y;
  // Transform point into the viewport coordinate system.
  var pointTransformed = svgPoint.matrixTransform(
    paper.viewport.getCTM().inverse()
  );
  return pointTransformed;
}

//draggable paper
paper.on("blank:pointerdown", function (evt, x, y) {
  var helpbox_area = document.getElementById("info-sidebar");
  helpbox_area.classList.add('inactive');

  var scale = V(paper.viewport).scale();
  dragStartPosition = { x: x * scale.sx, y: y * scale.sy };

  abortLink();
});

$("#paper-canvas").mousemove(function (evt) {
  if (typeof dragStartPosition !== "undefined") {
    paper.translate(
      evt.offsetX - dragStartPosition.x,
      evt.offsetY - dragStartPosition.y
    );
  }
});

// stop cell and paper dragging
paper.on("cell:pointerup blank:pointerup", function (cellView, x, y) {
  delete dragStartPosition;
});

function setGrid(storageGraph) {
  if (!storageGraph) {
    showGrid = !showGrid;
    addState();
  }

  if (showGrid) {
    // Set grid size on the JointJS paper object (joint.dia.Paper instance)
    paper.options.gridSize = 10;
    // Draw a grid into the HTML 5 canvas and convert it to a data URI image
    var canvas = $("<canvas/>", { width: 10, height: 10 });
    canvas[0].width = 10;
    canvas[0].height = 10;
    var context = canvas[0].getContext("2d");
    context.beginPath();
    context.rect(1, 1, 1, 1);
    context.fillStyle = "#AAAAAA";
    context.fill();
    // Finally, set the grid background image of the paper container element.
    var gridBackgroundImage = canvas[0].toDataURL("image/png");
    paper.$el.css("background-image", 'url("' + gridBackgroundImage + '")');
    document.getElementById('btn_grid').classList.add('grid_disabled');
  } else {
    paper.options.gridSize = 0.5;
    paper.$el.css("background-image", "none");
    document.getElementById('btn_grid').classList.remove('grid_disabled');
  }
}

const chPositionSequence = [];
graph.on("all", function (eventName, cell) {

  // Check change position series of events
  if (
    eventName === "batch:start" &&
    cell.batchName === "pointer" &&
    !chPositionSequence.includes("pointer")
  ) {
    chPositionSequence.push("pointer");
  }
  if (
    eventName === "change:position" &&
    chPositionSequence.includes("pointer") &&
    !chPositionSequence.includes("chPosition")
  ) {
    chPositionSequence.push("chPosition");
  }

  switch (eventName) {
    case "batch:stop":
      if (["anchor", "segment", "vertex", "arrowhead"].includes(cell.batchName.split("-")[0])) {
        addState();
      }
      if (cell.batchName === "pointer" && chPositionSequence.length === 2) {
        addState();
        chPositionSequence.splice(0);
      }
      break;
  }
});
