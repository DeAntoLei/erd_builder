var selectedCell;

var elementHelpboxContent = document.getElementById("element-helpbox-content");
var isWeakKeyDiv = document.getElementById("isWeakKeyDiv");
var keySeparatorDiv = document.getElementById('complex-key-separator');
var isCoveringDiv = document.getElementById("isCoveringDiv");
var linkHelpboxContent = document.getElementById("link-helpbox-content");

var inputElementWidthText = document.getElementById("input-el-width-text");
var inputElementWidthRange = document.getElementById("input-el-width-range");
var inputElementHeightText = document.getElementById("input-el-height-text");
var inputElementHeightRange = document.getElementById("input-el-height-range");

function showHelpbox(cell) {
  // Ensure that the 2 content areas for elements - links respectively are hidden
  elementHelpboxContent.style.display = "none";
  isWeakKeyDiv.style.display = "none";
  keySeparatorDiv.style.display = 'none';
  isCoveringDiv.style.display = "none";
  linkHelpboxContent.style.display = "none";

  // Get selected cell and necessary elements
  selectedCell = cell;
  var helpbox = document.getElementById("info-sidebar");

  // Populate the helpbox and the info box, based on the selected cell's type
  if (selectedCell.isElement()) {
    var inputElementName = document.getElementById("input-el-name");
    inputElementName.value = selectedCell.attr("text/text");
    var inputFontSize = document.getElementById('fontSize');
    inputFontSize.value = selectedCell.attr("text/font-size");
    var selectFontFamily = document.getElementById('fontFamily');
    selectFontFamily.value = selectedCell.attr("text/font-family");
    
    inputElementWidthText.value = selectedCell.prop("size/width");
    inputElementWidthRange.value = selectedCell.prop("size/width");
    inputElementHeightText.value = selectedCell.prop("size/height");
    inputElementHeightRange.value = selectedCell.prop("size/height");
    if (selectedCell.prop("type") === "tm.Key") {
      inputElementName.value = inputElementName.value.replace(/, /g, ';');
      isWeakKeyDiv.style.display = "block";
      document.getElementById('isWeakKey').checked = (selectedCell.attr('text/text-decoration') === 'underline') ? false : true;
      keySeparatorDiv.style.display = 'block';
    }
    else if(selectedCell.prop("type") === "tm.ISA") {
      isCoveringDiv.style.display = "block";
      const currentIsa = isaElements.find(isa => isa.id === selectedCell.id);
      document.getElementById('isCoveringIsa').checked = currentIsa ? currentIsa.isCovering : false;
    }

    elementHelpboxContent.style.display = "block";
  } else if (selectedCell.isLink()) {
    while (linkHelpboxContent.firstChild) {
      linkHelpboxContent.removeChild(linkHelpboxContent.lastChild);
    }

    const labels = selectedCell.prop("labels");
    if (labels) {
      labels.forEach((l, index) => {
        const span = document.createElement("span");
        span.innerHTML = "Crdinality:"
        const linkLabelInput = document.createElement("input");
        linkLabelInput.classList.add('input-purple');
        linkLabelInput.type = "text";
        linkLabelInput.id = "input-link-label-" + index;
        linkLabelInput.placeholder = "link_label";
        linkLabelInput.value = l.attrs.text.text;
        linkLabelInput.oninput = ((input, index) => {
          return () => { updateLabel(input.value, index); };
        })(linkLabelInput, index);
        linkLabelInput.onchange = (() => {
          return () => { addState(); };
        })();
        
        linkHelpboxContent.appendChild(span);
        linkHelpboxContent.appendChild(linkLabelInput);
      })
    } else {
      const noLabelsSupport = document.createElement("label");
      noLabelsSupport.innerText = 'This link does not support labels.';
      linkHelpboxContent.appendChild(noLabelsSupport);
    }

    linkHelpboxContent.style.display = "block";
  }

  helpbox.classList.remove('inactive')
}

function updateFontSize(value){
  selectedCell.attr("text/font-size", value);
}

function updateFontFamily(value) {
  selectedCell.attr("text/font-family", value);
  addState();
}

function updateName(value) {
  if (!["tm.Normal", "tm.Key", "tm.Multivalued", "tm.Derived"].includes(selectedCell.prop("type"))) {
    // Resize element based on new text length
    selectedCell.prop("size/width", value.length * 12);
    if (["tm.RelationShip", "tm.Identifying_Relationship", "tm.Aggregation",].includes(selectedCell.prop("type"))) {
      if (selectedCell.prop("size/width") < selectedCell.prop("size/height")) {
        selectedCell.prop("size/width", selectedCell.prop("size/height"));
      }
    } else if (["tm.Weak_Entity", "tm.Entity", "tm.ISA"].includes(selectedCell.prop("type"))) {
      if (selectedCell.prop("size/width") < 2 * selectedCell.prop("size/height")) {
        selectedCell.prop("size/width", 2 * selectedCell.prop("size/height"));
      }
    }
    inputElementWidthRange.value = selectedCell.prop("size/width");
    inputElementWidthText.value = selectedCell.prop("size/width");
  } 
  // should we keep it
  else {
    value = joint.util.breakText(value, { width: selectedCell.prop("size/width") - 15 })
  }

  selectedCell.attr("text/text", value.replace(/;/g, ', '));
}

function updateWidth(input) {
  if (input.type === "number") {
    inputElementWidthRange.value = input.value;
  } else {
    inputElementWidthText.value = input.value;
  }
  selectedCell.resize(input.value, selectedCell.prop("size/height"));
}

function updateHeight(input) {
  if (input.type === "number") {
    inputElementHeightRange.value = input.value;
  } else {
    inputElementHeightText.value = input.value;
  }
  selectedCell.resize(selectedCell.prop("size/width"), input.value);
}

function updateLabel(value, index) {
  selectedCell.label(index, {
    attrs: { text: { text: value } },
  });
}

function isWeakKey() {
  if (document.getElementById('isWeakKey').checked) {
    selectedCell.attr('text/text-decoration', 'underline dashed');
  } else {
    selectedCell.attr('text/text-decoration', 'underline');
  }
  addState();
}

function isCoveringIsa() {
  isaElements.forEach((isa, index) => {
    if (isa.id === selectedCell.id) {
      isaElements[index].isCovering = document.getElementById('isCoveringIsa').checked;
      return;
    }
  })
  isaElements.push({ id: selectedCell.id, isCovering: document.getElementById('isCoveringIsa').checked })
  addState();
}

function dismiss(id) {
  switch (id) {
    case 'help':
      elementHelpboxContent.style.display = "none";
      linkHelpboxContent.style.display = "none";
      document.getElementById("info-sidebar").classList.add('inactive');
      break;
    default: 
      if (document.getElementById(id)) { document.getElementById(id).remove(); }
      break;
  }
}
