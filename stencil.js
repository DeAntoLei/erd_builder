let hashmap = new Map([
  ["erd.Entity", "new joint.shapes.tm.Entity({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.WeakEntity", "new joint.shapes.tm.Weak_Entity({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Relationship", "new joint.shapes.tm.Relationship({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.IdentifyingRelationship", "new joint.shapes.tm.Identifying_Relationship({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.ISA", "new joint.shapes.tm.ISA({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Normal", "new joint.shapes.tm.Normal({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Key", "new joint.shapes.tm.Key({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Multivalued", "new joint.shapes.tm.Multivalued({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Derived", "new joint.shapes.tm.Derived({ attrs: { text: { text: cellView.model.attr('text/text') } } })",],
  ["erd.Aggregation", "new joint.shapes.tm.Aggregation({ attrs: { text: { text: cellView.model.attr('text/text') } } })",]
]);

var stencilGraph = new joint.dia.Graph(),
  stencilPaper = new joint.dia.Paper({
    el: $("#stencil-canvas-content"),
    height: $("#stencil-canvas-content").height(),
    width: $("#stencil-canvas-content").width(),
    model: stencilGraph,
    interactive: false,
    background: {
      color: "#bfbfbf",
    },
  });

var r1 = new joint.shapes.erd.Entity({
  position: {
    x: 40,
    y: 10,
  },
  size: {
    width: 90,
    height: 40,
  },
  attrs: {
    text: {
      text: "Entity",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var WR = new joint.shapes.erd.WeakEntity({
  position: { x: 185, y: 10 },
  size: { width: 100, height: 40 },
  attrs: {
    text: {
      fill: "black",
      text: "Weak Entity",
    },
    ".inner": {
      fill: "#ebebe0",
      stroke: "#800000",
      points: "155,5 155,55 5,55 5,5",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      points: "160,0 160,60 0,60 0,0",
      filter: {
        name: "dropShadow",
        args: { dx: 0.5, dy: 2, blur: 2, color: "#333333" },
      },
    },
  },
});

stencilGraph.addCells([r1, WR]);

var stencilGraph2 = new joint.dia.Graph(),
  stencilPaper2 = new joint.dia.Paper({
    el: $("#stencil-canvas-content2"),
    height: $("#stencil-canvas-content2").height(),
    width: $("#stencil-canvas-content2").width(),
    model: stencilGraph2,
    interactive: false,
    background: {
      color: "#bfbfbf",
    },
  });

var c1 = new joint.shapes.erd.Normal({
  position: {
    x: 40,
    y: 10,
  },
  size: {
    width: 90,
    height: 40,
  },
  attrs: {
    text: {
      text: "Normal",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var c2 = new joint.shapes.erd.Key({
  position: {
    x: 190,
    y: 10,
  },
  size: {
    width: 90,
    height: 40,
  },
  attrs: {
    text: {
      text: "Key"
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var c3 = new joint.shapes.erd.Multivalued({
  position: {
    x: 40,
    y: 70,
  },
  size: {
    width: 90,
    height: 40,
  },
  attrs: {
    text: {
      text: "Multivalued",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      "stroke-width": "4",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
    ".inner": {
      fill: "#ebebe0",
      stroke: "none",
    },
  },
});

var c4 = new joint.shapes.erd.Derived({
  position: {
    x: 190,
    y: 70,
  },
  size: {
    width: 90,
    height: 40,
  },
  attrs: {
    text: {
      text: "Derived",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

stencilGraph2.addCells([c1, c2, c3, c4]);

var stencilGraph3 = new joint.dia.Graph(),
  stencilPaper3 = new joint.dia.Paper({
    el: $("#stencil-canvas-content3"),
    height: $("#stencil-canvas-content3").height(),
    width: $("#stencil-canvas-content3").width(),
    model: stencilGraph3,
    interactive: false,
    background: {
      color: "#bfbfbf",
    },
  });

var rel1 = new joint.shapes.erd.IdentifyingRelationship({
  position: { x: 190, y: 10 },
  attrs: {
    text: {
      fill: "black",
      text: "Weak Rel.",
      letterSpacing: 0,
    },
    ".inner": {
      fill: "#ebebe0",
      stroke: "#800000",
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var rel2 = new joint.shapes.erd.Relationship({
  position: { x: 45, y: 10 },
  attrs: {
    text: {
      fill: "black",
      text: "Rel/ship",
      letterSpacing: 0,
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var isa = new joint.shapes.erd.ISA({
  position: { x: 35, y: 150 },
  attrs: {
    text: {
      text: "ISA",
      fill: "black",
      letterSpacing: 0,
    },
    polygon: {
      fill: "#ebebe0",
      stroke: "#800000",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 2, blur: 1, color: "#333333" },
      },
    },
  },
});

var Aggregation = joint.dia.Element.define('erd.Aggregation', {
  markup: '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',
  attrs: {
    text: {
      "font-size": "12",
      "xml:space": "preserve",
      y: "3.8em",
      x: "3.3em",
      "text-anchor": "middle",
      "font-family": "Arial",
      fill: "#000000",
      letterSpacing: 0,
    },
    ".outer": {
      fill: "#ebebe0",
      stroke: "#800000",
      "stroke-width": "2",
      points: "80,1 80,78 1,78 1,1",
      filter: {
        name: "dropShadow",
        args: { dx: 0, dy: 0, blur: 2, color: "#333333" },
      },
    },
    ".inner": {
      fill: "#ebebe0",
      stroke: "#800000",
      "stroke-width": "2",
      points: "40,5 75,40 40,75 5,40",
      display: "auto",
      
    },
  },
  size: { width: 80, height: 80 },
});

var aggregation = new joint.shapes.erd.Aggregation({
  position: { x: 190, y: 130 },
  attrs: {
    text: {
      text: "Aggreg.",
    }
  }
})

stencilGraph3.addCells([rel1, rel2, isa, aggregation]);

function changeArrowPosition(button) {
  const icon = button.querySelector("i");
  if (icon.classList.contains("fa-chevron-down")) {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  } else {
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }
}

stencilPaper.on("cell:pointerdown", cloneCell);
stencilPaper2.on("cell:pointerdown", cloneCell);
stencilPaper3.on("cell:pointerdown", cloneCell);

function cloneCell(cellView, evt, x, y) {
  $("body").append(
    '<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>'
  );
  const flyGraph = new joint.dia.Graph();
  const flyPaper = new joint.dia.Paper({
    el: $("#flyPaper"),
    model: flyGraph,
    height: 100,
    width: 100,
    interactive: false,
  });
  const initialPos = cellView.model.position();
  const offset = {
    x: x - initialPos.x,
    y: y - initialPos.y,
  };

  const flyShape = eval(hashmap.get(cellView.model.attributes.type));
  flyShape.position(0, 0);
  flyGraph.addCell(flyShape);
  
  $('body').on('mousemove.fly', (evt) => {
    $('#flyPaper').offset({
      left: evt.clientX - offset.x,
      top: evt.clientY - offset.y,
    });
  });

  $('body').on('mouseup.fly', (evt) => {
    const x = evt.clientX;
    const y = evt.clientY;
    const target = paper.$el.offset();

    // Dropped over paper ?
    if (x > target.left && y > target.top) {
      const s = flyShape.clone();
      const finalPos = paper.clientToLocalPoint({ x: x, y: y });
      s.position(finalPos.x - offset.x, finalPos.y - offset.y);

      graph.addCell(s);
      if (s.prop("type") === "tm.ISA") { isaElements.push({ id: s.id, isCovering: false }); }
	    s.toFront();
      
      addState();
    }

    $("body").off("mousemove.fly").off("mouseup.fly");
    flyShape.remove();
    $("#flyPaper").remove();
  });
}
