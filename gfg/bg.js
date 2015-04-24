chrome.commands.onCommand.addListener(function(command) {
  if (command == "import") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, {command: "importbg2main"}, function() {});  
		});
	} else if(command == "export") {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, {command: "exportbg2main"}, function() {});  
		});
	} else if(command == "toggle") {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {command: "togglebg2main"}, 
				  function(response) {});  
		});
	}
});