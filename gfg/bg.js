var settings_;
var import_items_;

//Synchronous XMLHttpRequest on the main thread deprecated TBD
function readfile() {
if(typeof import_items_ == "undefined") {
		var savedlist = chrome.extension.getURL('saved.list');
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", savedlist, true);
    rawFile.onreadystatechange = function () {
			if(rawFile.readyState === 4) {
				if(rawFile.status === 200 || rawFile.status == 0) {
					import_items_ = rawFile.responseText;
				}
			}
    }
    rawFile.send(null);	
}
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.command=="setbgsettings"){
		settings_=message.data;
		sendResponse("bg: saved settings");
	} else if(message.command=="getbgsettings"){
		sendResponse(settings_);
	} 
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "import") {
		readfile();
		if(typeof import_items_ !== "undefined") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					chrome.tabs.sendMessage(tabs[0].id, {command: "setbgitems2main",
					data: import_items_}, function(response) {});  
			});
		}
	} else if(command == "export") {
		//needtofigureout for filewrite TBD
		if (typeof localStorage['gfgbg'] == 'undefined') {
        var list = [];
        localStorage.setItem('gfgbg', JSON.stringify(list));
    }
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, {command: "getbgitems2main"}, function(response) {
				if(typeof response !== "undefined") {
					var a = JSON.parse(response.gfg);
					localStorage.setItem('gfgbg', JSON.stringify(a));
				}
			});  
		});
	} else if(command == "toggle") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {command: "togglebg2main"}, 
				  function(response) {});  
		});
	}
});