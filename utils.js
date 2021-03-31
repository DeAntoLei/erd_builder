var highlightEls = [];

function selectElement(elementView, ctrlKey) {
  if (!ctrlKey && highlightEls.includes(elementView)) {
    deselectElement(elementView);
  } else {
    if (!ctrlKey) {
      deselectAll();
    }
    highlightEls.push(elementView);

    enableNavItems();
    if (highlightEls.length > 1) {
      document.getElementById('nav_dpl').classList.add('disabled');
    }
    
    if (!elementView.model.attr(".outer")) {
      elementView.model.attr({ "polygon": { stroke: "orange" } });
      return;
    }
    elementView.model.attr({ ".outer": { stroke: "orange" } });
  }
}

function deselectElement(elementView) {
  if (!elementView.model.attr(".outer")) {
    elementView.model.attr({ "polygon": { stroke: "#800000" } });  
  } else {
    elementView.model.attr({ ".outer": { stroke: "#800000" } });
  }
  highlightEls.splice( highlightEls.findIndex((el) => el === elementView), 1);

  if (highlightEls.length === 0) {
    disableNavItems(true);
  } else if (highlightEls.length === 1) {
    document.getElementById('nav_dpl').classList.remove('disabled');
  }
}

function selectAll() {
  let elementView;
  for (let element of graph.getElements()) {
    elementView = element.findView(paper);
    selectElement(elementView, true);
  }
}

function deselectAll() {
  for (let i = 0; i < highlightEls.length; i++) {
    if (!highlightEls[i].model.attr(".outer")) {
      highlightEls[i].model.attr({ "polygon": { stroke: "#800000" } });  
    } else {
      highlightEls[i].model.attr({ ".outer": { stroke: "#800000" } });
    }
  }
  highlightEls = [];

  disableNavItems(true);
}

function removeSelected() {
  for (let i = 0; i < highlightEls.length; i++) {
    highlightEls[i].model.remove();
  }
  addState();

  highlightEls = [];

  disableNavItems(false);
}

function moveToFront() {
  for (let i = 0; i < highlightEls.length; i++) {
    highlightEls[i].model.toFront();
  }
  deselectAll();
  addState();
}

function moveToBack() {
  for (let i = 0; i < highlightEls.length; i++) {
    highlightEls[i].model.toBack();
  }
  deselectAll();
  addState();
}

function disableButtons(type, inclBtn) {
  if (inclBtn) { document.getElementById(`btn_${type}`).classList.add('disabled'); }
  document.getElementById(`ctx_${type}`).classList.add('disabled');
  document.getElementById(`nav_${type}`).classList.add('disabled');
}

function enableButtons(type, inclBtn) {
  if (inclBtn) { document.getElementById(`btn_${type}`).classList.remove('disabled'); }
  document.getElementById(`ctx_${type}`).classList.remove('disabled');
  document.getElementById(`nav_${type}`).classList.remove('disabled');
}

function disableNavItems(navDpl) {
  document.getElementById('nav_del').classList.add('disabled');
  document.getElementById('nav_cut').classList.add('disabled');
  document.getElementById('nav_copy').classList.add('disabled');
  if (navDpl) { document.getElementById('nav_dpl').classList.add('disabled'); }
}

function enableNavItems() {
  document.getElementById('nav_del').classList.remove('disabled');
  document.getElementById('nav_cut').classList.remove('disabled');
  document.getElementById('nav_copy').classList.remove('disabled');
  document.getElementById('nav_dpl').classList.remove('disabled');
}
