// LOCALSTORAGE-HANDLING
function createLocalStorageItem(cookieName, cookieValue) {
  var date = new Date();

  // LOCAL STORAGE
  const item = {
    value: cookieValue,
    expiry: date.getTime() + 60 * 60 * 1000,
  };
  localStorage.setItem(cookieName, JSON.stringify(item));
}

function accessLocalStorageItem(cookieName) {
  // LOCAL STORAGE
  const itemStr = localStorage.getItem(cookieName);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return "";
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(cookieName);
    return "";
  }
  return item.value;
}

function checkGraphLocalStorageItem() {
  var prGraph = accessLocalStorageItem("graph_snapshot");
  if (prGraph != "") {
    graph.fromJSON(JSON.parse(prGraph));
    showGrid = JSON.parse(accessLocalStorageItem("grid_enabled"));
    setGrid(true);
  }
}
