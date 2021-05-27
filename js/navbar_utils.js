// Menu Toggle script
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.contains('active') ? sidebar.classList.remove('active') : sidebar.classList.add('active');
  const content = document.getElementById('content');
  content.classList.contains('active') ? content.classList.remove('active') : content.classList.add('active');
}

function newPage(){
  var retVal = confirm("Are you sure you want to make a new project ?");
  if(retVal == true) {  
    graph.clear();
    resetStates();

    disableButtons('undo', true);
    disableButtons('redo', true);

    if (document.getElementById("file-upload").value) {
      document.getElementById("inputfile").value = '';
      document.getElementById("filename").innerHTML = 'Choose file';

      disableButtons('save', true);
      document.getElementById("dismiss-btn").style.display = "none";
      document.getElementById("nav_close").classList.add('disabled');
    }
  }
}