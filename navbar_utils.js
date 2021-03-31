function newPage(){
  var retVal = confirm("Are you sure you want to make a new project ?");
  if(retVal == true) {  
    graph.clear();
    resetStates();

    disableButtons('undo', true);
    disableButtons('redo', true);

    if (document.getElementById("inputfile").value) {
      document.getElementById("inputfile").value = '';
      document.getElementById("filename").innerHTML = 'Choose file';

      disableButtons('save', true);
      document.getElementById("x_btn").style.display = "none";
      document.getElementById("nav_close").classList.add('disabled');
    }
  }
}