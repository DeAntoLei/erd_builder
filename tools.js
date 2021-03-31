document.addEventListener("keydown", (e) => {
  var evtobj = window.event ? event : e;
  if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
    undo();
  }
  if (evtobj.keyCode === 89 && evtobj.ctrlKey) {
    redo();
  }
  if (evtobj.keyCode === 27) {
    abortLink();
  }
  if (evtobj.keyCode === 46) {
    removeSelected();
  }
  if (evtobj.keyCode === 65 && evtobj.ctrlKey) {
    evtobj.preventDefault();
    selectAll();
  }
  if (evtobj.keyCode === 67 && evtobj.ctrlKey) {
    copy(false);
  }
  if (evtobj.keyCode === 86 && evtobj.ctrlKey) {
    paste(false);
  }
  if (evtobj.keyCode === 88 && evtobj.ctrlKey) {
    cut(false);
  }
});

function addState() {
  if (graph_states.length - 1 > currentState) {
    graph_states.splice(currentState + 1);
    grid_states.splice(currentState + 1);
    disableButtons('redo', true);
  }

  graph_states.push(JSON.stringify(graph.toJSON()));
  grid_states.push(showGrid);
  currentState = graph_states.length - 1;
  if (currentState != 0) {
    enableButtons('undo', true);
  }

  // LOCALSTORAGE-HANDLING
  createLocalStorageItem('graph_snapshot', JSON.stringify(graph.toJSON()));
  createLocalStorageItem('grid_enabled', JSON.stringify(showGrid));
}

function undo() {
  if (currentState === 0) {
    console.error("That's it, bowl's empty");
    return;
  }

  currentState -= 1;
  graph.fromJSON(JSON.parse(graph_states[currentState]));
  showGrid = grid_states[currentState];
  setGrid(true);

  enableButtons('redo', true);
  if (currentState === 0) { 
    disableButtons('undo', true);
  } else { 
    enableButtons('undo', true)
  }

  // LOCALSTORAGE-HANDLING
  createLocalStorageItem('graph_snapshot', JSON.stringify(graph.toJSON()));
  createLocalStorageItem('grid_enabled', JSON.stringify(showGrid));
}

function redo() {
  if (currentState === graph_states.length - 1) {
    console.error("Nothing to do more than think of another career");
    return;
  }

  currentState += 1;
  graph.fromJSON(JSON.parse(graph_states[currentState]));
  showGrid = grid_states[currentState];
  setGrid(true);

  enableButtons('undo', true);
  if (currentState === graph_states.length - 1) { 
    disableButtons('redo', true);
  } else {
    enableButtons('redo', true);
  }

  // LOCALSTORAGE-HANDLING
  createLocalStorageItem('graph_snapshot', JSON.stringify(graph.toJSON()));
  createLocalStorageItem('grid_enabled', JSON.stringify(showGrid));
}

function resetStates() {
  graph_states = [];
  grid_states = [];
  currentState;
  showGrid = true;
  setGrid(false);
}

let i = 1;

function zoomInFunction() {
  i = i + 0.1;
  paper.scale(i);
}

function zoomOutFunction() {
  i = i - 0.1;
  paper.scale(i);
}

function clearFunction() {
  var retrVal = confirm("Are you sure you want to delete the selected / all elements ?");
  if (retrVal) {
    if (highlightEls.length) {
      removeSelected()
    }
    else if (graph.attributes.cells.length != 0) {
      graph.clear();

      addState();
    }
  }
}

function closeLoadedFile() {
  var retrVal = confirm("Are you sure you want to close the file ?");
  if (retrVal) {
    // Initialize input type file
    document.getElementById("inputfile").value = '';
    document.getElementById("filename").innerHTML = 'Choose file';
    // clear graph
    graph.clear();
    resetStates();
    // Disable buttons
    disableButtons('save', true);
    disableButtons('undo', true);
    disableButtons('redo', true);
    document.getElementById("nav_close").classList.add('disabled');
    // Hide x button
    document.getElementById("x_btn").style.display = "none";

  }
}

$(document).ready(() => {
  $('#saveButtonJSON').addClass('disabled');
  $('#saveButtonImage').addClass('disabled');
  $('#saveButtonPDF').addClass('disabled');
  $('#inputDownloadName').keyup(function() {
      if($(this).val().length !=0) {
        $('#saveButtonJSON').removeClass('disabled');      
        $('#saveButtonImage').removeClass('disabled');   
        $('#saveButtonPDF').removeClass('disabled');    
      }     
      else {
        $('#saveButtonJSON').addClass('disabled');      
        $('#saveButtonImage').addClass('disabled');   
        $('#saveButtonPDF').addClass('disabled');
      }    
    })
});

$(document).ready(() => {
  $('#saveButtonImage').click(saveImage);
  $('#navSaveButtonImage').click(saveImage);
});

function saveImage() {
  var databack = $("#downloadModal #inputDownloadName").val().trim();
  if (databack === '') { databack = 'erd_' + new Date().toISOString().substring(0, 10); }
  const body = document.querySelector("#paper-canvas");
  capture(body, databack);
}

function capture(body, img_name) {
  html2canvas(body)
    .then((canvas) => {
      document.body.appendChild(canvas);
    })
    .then(() => {
      var canvas = document.querySelector("canvas");
      canvas.style.display = "none";
      var image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      var a = document.createElement("a");
      a.setAttribute("download", img_name + ".png");
      a.setAttribute("href", image);
      a.click();
      canvas.remove();
    });
}

function downloadToPdf(){
  var databack = $("#downloadModal #inputDownloadName").val().trim();
  if (databack === '') { databack = 'erd_' + new Date().toISOString().substring(0, 10); }
  var HTML_Width = $("#paper-canvas").width();
  console.log(HTML_Width);
  var HTML_Height = $("#paper-canvas").height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + (top_left_margin * 2);
  var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($("#paper-canvas")[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) { 
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
    }
    pdf.save(databack+".pdf");
  });
}

function saveJSON(isOnModal) {
  var databack = (isOnModal) ? $("#downloadModal #inputDownloadName").val().trim() : $("#filename").html().split('.')[0];
  if (databack === 'Choose file') { databack = `erd_${new Date().toISOString().substring(0, 10)}`; }
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(graph.toJSON()));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", databack + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function warningAlert(warningMessage) {
  let warningAlert = document.getElementById('warningAlert')
  warningAlert.style.display = 'block';
  setTimeout(() => {
    warningAlert.style.display = 'none';
  }, 3000);
  document.getElementById('warning_message').innerHTML = warningMessage;
}
