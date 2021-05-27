joint.shapes.tm = {};

// Tools for elements
joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({
  toolMarkup: [
    '<g class="element-tools">',
    '<g class="element-tool-remove"><circle fill="white" stroke="red" r="11"/>',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" fill="red"/>',
    "<title>Remove this element from the model</title>",
    "</g>",

    '<g class="element-tool-link"><circle fill="white" stroke="grey" r="11" cx="25"/>',
    '<path transform="scale(.6) translate(29, -12)" d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" fill="grey"/>',
    "<title>Link element</title>",
    "</g>",

    '<g class="element-tool-highlight"><circle fill="white" stroke="#ff8000" r="11" cx="50"/>',
    '<path transform="scale(.6) translate(74, -12)" d="M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z" fill="#ff8000"/>',
    "<title>Highlight element</title>",
    "</g>",

    '<g class="element-tool-break-connections"><circle fill="white" stroke="#a52a2a" r="11" cx="75"/>',
    '<path transform="scale(.6) translate(112, -12)" d="M12.026 14.116c-3.475 1.673-7.504 3.619-8.484 4.09-1.848.889-3.542-1.445-3.542-1.445l8.761-4.226 3.265 1.581zm7.93 6.884c-.686 0-1.393-.154-2.064-.479-1.943-.941-2.953-3.001-2.498-4.854.26-1.057-.296-1.201-1.145-1.612l-14.189-6.866s1.7-2.329 3.546-1.436c1.134.549 5.689 2.747 9.614 4.651l.985-.474c.85-.409 1.406-.552 1.149-1.609-.451-1.855.564-3.913 2.51-4.848.669-.321 1.373-.473 2.054-.473 2.311 0 4.045 1.696 4.045 3.801 0 1.582-.986 3.156-2.613 3.973-1.625.816-2.765.18-4.38.965l-.504.245.552.27c1.613.789 2.754.156 4.377.976 1.624.819 2.605 2.392 2.605 3.97 0 2.108-1.739 3.8-4.044 3.8zm-2.555-12.815c.489 1.022 1.876 1.378 3.092.793 1.217-.584 1.809-1.893 1.321-2.916-.489-1.022-1.876-1.379-3.093-.794s-1.808 1.894-1.32 2.917zm-3.643 3.625c0-.414-.335-.75-.75-.75-.414 0-.75.336-.75.75s.336.75.75.75.75-.336.75-.75zm6.777 3.213c-1.215-.588-2.604-.236-3.095.786-.491 1.022.098 2.332 1.313 2.919 1.215.588 2.603.235 3.094-.787.492-1.021-.097-2.33-1.312-2.918z" fill="#a52a2a"/>',
    "<title>Break all connections</title>",
    "</g>",

    "</g>",
  ].join(""),

  defaults: joint.util.deepSupplement(
    {
      attrs: {
        text: {
          "font-weight": 400,
          "font-size": "small",
          fill: "black",
          "text-anchor": "middle",
          "ref-x": 0.5,
          "ref-y": 0.5,
        },
      },
    },
    joint.shapes.basic.Generic.prototype.defaults
  ),
});

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({
  initialize: function () {
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments);

    this.renderTools();
    this.update();

    return this;
  },
  renderTools: function () {
    var toolMarkup = this.model.toolMarkup || this.model.get("toolMarkup");

    if (toolMarkup) {
      var nodes = V(toolMarkup);
      V(this.el).append(nodes);
    }

    return this;
  },
  pointerclick: function (evt, x, y) {
    this._dx = x;
    this._dy = y;
    this._action = "";

    var className = evt.target.parentNode.getAttribute("class");

    switch (className) {
      case "element-tool-remove":
        var retrVal = confirm("Are you sure you want to delete this element ?");
        if (retrVal) {
          var connLinks = graph.getConnectedLinks(this.model);
          for (l of connLinks) {
            l.remove();
          }
          this.model.remove();

          addState();
        }
        break;
      case "element-tool-link":
        createLink(this);
        break;
      case "element-tool-break-connections":
        var connLinks = graph.getConnectedLinks(this.model);
        for (l of connLinks) {
          l.remove();
        }
          
        addState();
        break;
      case "element-tool-highlight":
        evt.stopPropagation();
        selectElement(this, evt.ctrlKey);
        break;
      default:
    }

    joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
  },
});

// Custom entity to include tools. We need to do this for all custom elements
joint.shapes.tm.Entity = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1.5,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Entity",
      attrs: {
        text: {
          "font-size": "14",
          "xml:space": "preserve",
          y: "0.7em",
          x: "0.5em",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "95,5 95,55 5,55 5,5"
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "100,0 100,60 0,60 0,0",
          display: "none"
        },
      },
      size: { width: 95, height: 40 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.EntityView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Weak_Entity = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(0.9375	,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Weak_Entity",
      attrs: {
        text: {
          "font-size": "14",
          "xml:space": "preserve",
          y: "0.3em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "160,0 160,60 0,60 0,0"
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "155,5 155,55 5,55 5,5",
          display: "auto",
        },
      },
      size: { width: 100, height: 40 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.Weak_EntityView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Identifying_Relationship = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Identifying_Relationship",
      attrs: {
        text: {
          "font-size": "12",
          "xml:space": "preserve",
          y: "0.3em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "40,0 80,40 40,80 0,40"
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "40,6.7 73.3,40 40,73.3 6.7,40",
          display: "auto",
        },
      },
      size: { width: 85, height: 85 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.Identifying_RelationshipView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.ISA = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.ISA",
      attrs: {
        text: {
          "font-size": "12",
          "xml:space": "preserve",
          y: "-0.6em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        polygon: {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "0,0 50,50 100,0"
        },
      },
      size: { width: 100, height: 50 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.ISAView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Relationship = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Relationship",
      attrs: {
        text: {
          "font-size": "12",
          "xml:space": "preserve",
          y: "0.3em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "40,0 80,40 40,80 0,40"
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "40,5 75,40 40,75 5,40",
          display: "none",
        },
      },
      size: { width: 80, height: 80 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.RelationshipView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Normal = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><ellipse class="outer"></ellipse><ellipse class="inner"></ellipse></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Normal",
      attrs: {
        text: {
          "font-size": "14",
          "xml:space": "preserve",
          y: "0.3em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          refRx: 0.5,
          refRy: 0.5,
          refCx: 0.5,
          refCy: 0.5
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          refRx: 0.5,
          refRy: 0.5,
          refCx: 0.5,
          refCy: 0.5,
          display: "none",
        },
      },
      size: { width: 100, height: 40 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.NormalView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Key = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><ellipse class="outer"></ellipse><ellipse class="inner"></ellipse></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Key",
      attrs: {
        text: {
          "font-size": "14",
          "xml:space": "preserve",
          y: "0.3em",
          "text-anchor": "middle",
          "font-family": "Arial",
          "font-weight": "800",
          "text-decoration": "underline",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          refRx: 0.5,
          refRy: 0.5,
          refCx: 0.5,
          refCy: 0.5,
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          refRx: 0.5,
          refRy: 0.5,
          refCx: 0.5,
          refCy: 0.5,
          display: "none",
        },
      },
      size: { width: 100, height: 40 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.KeyView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Derived = joint.shapes.tm.toolElement.extend({
    markup:
      '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><ellipse class="outer"></ellipse><ellipse class="inner"></ellipse></g><text/></g>',

    defaults: joint.util.deepSupplement(
      {
        type: "tm.Derived",
        attrs: {
          text: {
            "font-size": "14",
            "xml:space": "preserve",
            y: "0.3em",
            "text-anchor": "middle",
            "font-family": "Arial",
            fill: "#7386D5",
            letterSpacing: 0,
          },
          ".outer": {
            fill: "#fff",
            stroke: "#7386D5",
            "stroke-dasharray": "3,2",
            "stroke-width": "2",
            refRx: .5,
            refRy: .5,
            refCx: .5,
            refCy: .5
          },
          ".inner": {
            fill: "#fff",
            stroke: "#7386D5",
            "stroke-width": "2",
            refRx: .5,
            refRy: .5,
            refCx: .5,
            refCy: .5,
            display: "none",
            
          },
        },
        size: { width: 100, height: 40 },
      },
      joint.shapes.tm.toolElement.prototype.defaults
    ),
  });

joint.shapes.tm.DerivedView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Multivalued = joint.shapes.tm.toolElement.extend({
    markup:
      '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><ellipse class="outer"></ellipse><ellipse class="inner"></ellipse></g><text/></g>',

    defaults: joint.util.deepSupplement(
      {
        type: "tm.Multivalued",
        attrs: {
          text: {
            "font-size": "14",
            "xml:space": "preserve",
            y: "0.3em",
            "text-anchor": "middle",
            "font-family": "Arial",
            fill: "#7386D5",
            letterSpacing: 0,
          },
          ".outer": {
            fill: "#fff",
            stroke: "#7386D5",
            "stroke-width": "4",
            refRx: .5,
            refRy: .5,
            refCx: .5,
            refCy: .5
          },
          ".inner": {
            fill: "#fff",
            stroke: "#7386D5",
            "stroke-width": "2",
            refRx: .5,
            refRy: .5,
            refCx: .5,
            refCy: .5,
            display: "none",
            
          },
        },
        size: { width: 100, height: 40 },
      },
      joint.shapes.tm.toolElement.prototype.defaults
    ),
  });

joint.shapes.tm.MultivaluedView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.Aggregation = joint.shapes.tm.toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable" transform="scale(1,1)"><polygon class="outer"></polygon><polygon class="inner"></polygon></g><text/></g>',

  defaults: joint.util.deepSupplement(
    {
      type: "tm.Aggregation",
      attrs: {
        text: {
          "font-size": "12",
          "xml:space": "preserve",
          y: "0.5em",
          "text-anchor": "middle",
          "font-family": "Arial",
          fill: "#7386D5",
          letterSpacing: 0,
        },
        ".outer": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "80,1 80,78 1,78 1,1"
        },
        ".inner": {
          fill: "#fff",
          stroke: "#7386D5",
          "stroke-width": "2",
          points: "40,5 75,40 40,75 5,40",
          display: "auto",
        },
      },
      size: { width: 80, height: 80 },
    },
    joint.shapes.tm.toolElement.prototype.defaults
  ),
});

joint.shapes.tm.AggregationView = joint.shapes.tm.ToolElementView;
