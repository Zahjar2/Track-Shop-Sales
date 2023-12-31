document.addEventListener("DOMContentLoaded", function () {
  var clearButton = document.getElementById("clearHistory");
  clearButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "clearHistory" });
  });
});
