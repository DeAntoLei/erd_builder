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
    elementView.model.attr({ "polygon": { stroke: "#7386D5" } });  
  } else {
    elementView.model.attr({ ".outer": { stroke: "#7386D5" } });
  }
  highlightEls.splice( highlightEls.findIndex((el) => el === elementView), 1);

  if (highlightEls.length === 0) {
    disableNavItems(true);
  } else if (highlightEls.length === 1) {
    document.getElementById('nav_dpl').classList.remove('disabled');
  }
}

function selectAll() {
  for (let element of graph.getElements()) {
    const elementView = element.findView(paper);
    selectElement(elementView, true);
  }
}

function deselectAll() {
  for (let i = 0; i < highlightEls.length; i++) {
    if (!highlightEls[i].model.attr(".outer")) {
      highlightEls[i].model.attr({ "polygon": { stroke: "#7386D5" } });  
    } else {
      highlightEls[i].model.attr({ ".outer": { stroke: "#7386D5" } });
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


$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass('show');
  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    $('.dropdown-submenu .show').removeClass("show");
  });
  
  return false;
});

const ro = new ResizeObserver(() => resizePaper());
ro.observe(document.querySelector('#main-canvas'));

function resizePaper() {
  const mainCanvas = document.getElementById('main-canvas');
  const paperCanvas = document.getElementById('paper-canvas');
  paper.setDimensions(mainCanvas.offsetWidth, mainCanvas.offsetHeight)
}
