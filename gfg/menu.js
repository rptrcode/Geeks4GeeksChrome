function init() {
	document.getElementById("settings").addEventListener("click",function() {
		chrome.runtime.openOptionsPage();
	}); 
}
window.addEventListener("DOMContentLoaded", init, false);
