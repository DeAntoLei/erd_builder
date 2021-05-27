const hashmap = new Map([
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

var entStencilGraph = new joint.dia.Graph(),
  entStencilPaper = new joint.dia.Paper({
    el: $("#stencil-canvas-ent-shapes"),
    height: $("#stencil-canvas-ent-shapes").height(),
    width: $("#stencil-canvas-ent-shapes").width(),
    model: entStencilGraph,
    interactive: false,
  });

var ent = new joint.shapes.erd.Entity({
  position: { x: 25, y: 15 },
  size: { width: 90, height: 40 },
  attrs: {
    text: { fill: "white", text: "Entity" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

var weakEnt = new joint.shapes.erd.WeakEntity({
  position: { x: 170, y: 15 },
  size: { width: 100, height: 40 },
  attrs: {
    text: { fill: "white", text: "Weak Entity" },
    ".inner": { fill: "#7386D5", stroke: "#fff", points: "155,5 155,55 5,55 5,5" },
    ".outer": { fill: "#7386D5", stroke: "#fff", points: "160,0 160,60 0,60 0,0" },
  }
});

entStencilGraph.addCells([ent, weakEnt]);

var attrStencilGraph = new joint.dia.Graph(),
  attrStencilPaper = new joint.dia.Paper({
    el: $("#stencil-canvas-attr-shapes"),
    height: $("#stencil-canvas-attr-shapes").height(),
    width: $("#stencil-canvas-attr-shapes").width(),
    model: attrStencilGraph,
    interactive: false,
  });

var normalAttr = new joint.shapes.erd.Normal({
  position: { x: 25, y: 15 },
  size: { width: 90, height: 40 },
  attrs: {
    text: { fill: "white", text: "Normal" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

var keyAttr = new joint.shapes.erd.Key({
  position: { x: 175, y: 15 },
  size: { width: 90, height: 40 },
  attrs: {
    text: { fill: "white", text: "Key" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

var multiVAttr = new joint.shapes.erd.Multivalued({
  position: { x: 25, y: 75 },
  size: { width: 90, height: 40 },
  attrs: {
    text: { fill: "white", text: "Multivalued" },
    ".outer": { fill: "#7386D5", stroke: "#fff", "stroke-width": "4" },
    ".inner": { fill: "#7386D5", stroke: "none" },
  }
});

var derivedAttr = new joint.shapes.erd.Derived({
  position: { x: 175, y: 75 },
  size: { width: 90, height: 40 },
  attrs: {
    text: { fill: "white", text: "Derived" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

attrStencilGraph.addCells([normalAttr, keyAttr, multiVAttr, derivedAttr]);

const relStencilGraph = new joint.dia.Graph(),
  relStencilPaper = new joint.dia.Paper({
    el: $("#stencil-canvas-rel-shapes"),
    height: $("#stencil-canvas-rel-shapes").height(),
    width: $("#stencil-canvas-rel-shapes").width(),
    model: relStencilGraph,
    interactive: false,
  });

const identRel = new joint.shapes.erd.IdentifyingRelationship({
  position: { x: 175, y: 15 },
  attrs: {
    text: { fill: "white", text: "Weak Rel." },
    ".inner": { fill: "#7386D5", stroke: "#fff" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

const rel = new joint.shapes.erd.Relationship({
  position: { x: 25, y: 15 },
  attrs: {
    text: { fill: "white", text: "Rel/ship" },
    ".outer": { fill: "#7386D5", stroke: "#fff" },
  }
});

const isa = new joint.shapes.erd.ISA({
  position: { x: 20, y: 135 },
  attrs: {
    text: { text: "ISA", fill: "white" },
    polygon: { fill: "#7386D5", stroke: "#fff" },
  }
});

const Aggregation = joint.dia.Element.define('erd.Aggregation', {
  markup: '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',
  attrs: {
    text: {
      "font-size": "12",
      "xml:space": "preserve",
      y: "3.8em",
      x: "3.3em",
      "text-anchor": "middle",
      "font-family": "Arial",
      fill: "#fff",
      letterSpacing: 0,
    },
    ".outer": {
      fill: "#7386D5",
      stroke: "#fff",
      "stroke-width": "2",
      points: "80,1 80,78 1,78 1,1",
    },
    ".inner": {
      fill: "#7386D5",
      stroke: "#fff",
      "stroke-width": "2",
      points: "40,5 75,40 40,75 5,40",
      display: "auto",
      
    },
  },
  size: { width: 80, height: 80 },
});

const aggregation = new joint.shapes.erd.Aggregation({
  position: { x: 175, y: 125 },
  attrs: { text: { text: "Aggreg." } }
})

relStencilGraph.addCells([identRel, rel, isa, aggregation]);

entStencilPaper.on("cell:pointerdown", cloneCell);
attrStencilPaper.on("cell:pointerdown", cloneCell);
relStencilPaper.on("cell:pointerdown", cloneCell);

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
