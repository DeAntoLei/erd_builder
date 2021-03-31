var currentMenu = document.getElementById("gen_menu");
var menuVisible = false;
var ctx_cellView;
var origin;

window.addEventListener("click", (e) => {
  if (menuVisible) toggleMenu("hide");

  deselectAll();
});

window.addEventListener('beforeunload', (event) => {
  event.returnValue = `Are you sure you want to leave?`;
});

paper.$el.on("contextmenu", function (evt) {
  evt.stopPropagation();
  evt.preventDefault();

  ctx_cellView = paper.findView(evt.target);

  origin = {
    left: evt.offsetX,
    top: evt.offsetY + 2 + document.getElementById("up-menu").offsetHeight,
  };
  if (!ctx_cellView) {
    if (menuVisible) toggleMenu("hide");
    currentMenu = document.getElementById("gen_menu");
    setPosition(origin);
  } else {
    if (menuVisible) toggleMenu("hide");
    currentMenu = document.getElementById("el_menu");

    enableContextButtons();
    setPosition(origin);
  }
});

window.addEventListener("contextmenu", (e) => {
  if (menuVisible) toggleMenu("hide");
});

const toggleMenu = (command) => {
  currentMenu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
  currentMenu.style.left = `${left}px`;
  currentMenu.style.top = `${top}px`;
  toggleMenu("show");
};

const enableContextButtons = () => {
  const buttonIds = ['ctx_dpl', 'ctx_del', 'ctx_to_front', 'ctx_to_back', 'ctx_break'];
  buttonIds.forEach(bId => {
    const button = document.getElementById(bId); 
    if (highlightEls.length > 1) {
      button.classList.add('disabled');
      return;
    }
    button.classList.remove('disabled');  
  })
}

const deleteElement = () => {
  if (ctx_cellView.model.isElement()) {
    var connLinks = graph.getConnectedLinks(ctx_cellView.model);
    for (l of connLinks) {
      l.remove();
    }
  }
  ctx_cellView.model.remove();

  addState();
};

const duplicate = (ctxMenu) => {
  let duplicateEl;
  if (ctxMenu) {
    if (ctx_cellView.model.isElement()) {
      duplicateEl = ctx_cellView.model.clone();
    } else {
      var duplicateLink = ctx_cellView.model.clone();
      duplicateLink.source({
        x: ctx_cellView.sourcePoint.x + 10,
        y: ctx_cellView.sourcePoint.y + 10,
      });
      duplicateLink.target({
        x: ctx_cellView.targetPoint.x + 10,
        y: ctx_cellView.targetPoint.y + 10,
      });
      for (let vertex of duplicateLink.vertices()) {
        vertex.x += 10;
        vertex.y += 10;
      }
      duplicateLink.addTo(graph);

      addState();
      return;
    }
  }
  else if (!ctxMenu && highlightEls.length === 1) {
    duplicateEl = highlightEls[0].model.clone();
  }
  duplicateEl = prepareCells([duplicateEl])[0];
  duplicateEl.prop("position").x = duplicateEl.prop("position").x + 10;
  duplicateEl.prop("position").y = duplicateEl.prop("position").y + 10;
  graph.addCell(duplicateEl);
  duplicateEl.toFront();
  addState();
};

let clipboard;
const copy = (ctxMenu) => {
  const cellsToBeCopied = []
  if (highlightEls.length) {
    for (el of highlightEls) {
      cellsToBeCopied.push(el.model);
    }

    clipboard = graph.cloneSubgraph(cellsToBeCopied);
    deselectAll();
    enableButtons('paste', false);

    return;
  }

  if (ctxMenu) {
    cellsToBeCopied.push(ctx_cellView.model);
    clipboard = graph.cloneSubgraph(cellsToBeCopied);
    enableButtons('paste', false);
  }
}

const cut = (ctxMenu) => {
  copy(ctxMenu);
  for (cellId of Object.keys(clipboard)) {
    if (graph.getCell(cellId)) graph.getCell(cellId).remove();
  }

  addState();
} 

const prepareCells = (cells) => {
  for (cell of cells) {
    if (cell.isElement() && !cell.attr(".outer")) {
      cell.attr({ "polygon": { stroke: "#800000" } });  
    } else if (cell.isElement()) {
      cell.attr({ ".outer": { stroke: "#800000" } });
    }
  }
  return cells
}

const findLeftElement = (clipboardCells) => {
  let leftElement;
  for (let i = 0; i < clipboardCells.length; i++) {
    if (clipboardCells[i].isElement() && !leftElement) {
      leftElement = clipboardCells[i];
    } else if (clipboardCells[i].isElement() && clipboardCells[i].prop("position/x") < leftElement.prop("position/x")) {
      leftElement = clipboardCells[i];
    }
  }
  return leftElement;
}

const findDisplacementDimensions = (clipboardCells) => {
  let dims = { width: 0, height: 0 };
  for (cell of clipboardCells) {
    if (cell.isElement()) {
      if (cell.prop("size/width") > dims.width) dims.width = cell.prop("size/width");
      if (cell.prop("size/height") > dims.height) dims.height = cell.prop("size/height");
    }
  }
  return dims;
}

const paste = (ctxMenu) => {
  const clipboardCells = prepareCells(Object.values(clipboard));
  if (ctxMenu) {
    const leftElement = findLeftElement(clipboardCells);
    const displacement = { x: origin.left - leftElement.prop("position/x"), y: origin.top - leftElement.prop("position/y") }
    for (cell of clipboardCells) {
      if (cell.isElement()) {
        cell.translate(displacement.x, displacement.y);
      }
    }
  } else {
    const dims = findDisplacementDimensions(clipboardCells);
    for (cell of clipboardCells) {
      if (cell.isElement()) {
        cell.translate(dims.width + 10, dims.height + 10);
      }
    }
  }
  graph.addCells(clipboardCells);
  disableButtons('paste', false);

  addState();
}

const breakConnections = () => {
  var connLinks = graph.getConnectedLinks(ctx_cellView.model);
  for (l of connLinks) {
    l.remove();
  }

  addState();
};
