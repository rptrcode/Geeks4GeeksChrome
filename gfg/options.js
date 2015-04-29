
function saveOptions() {
  var textdecval = document.getElementById('textdec').value;
  var opacityval = document.getElementById('opacity').value;
  var removelinksval = document.getElementById('removelinks').checked;
	var settings = [{textdec:textdecval, opacity:opacityval, removelinks:removelinksval}];
	writeSettingsStorage(settings);
}

function init() {
	readSettingsStorage(function (items) {
		if(typeof(items.gfgsettings) == 'undefined') {
		var list = [{"textdec":"line-through", "opacity":30, "removelinks":false}];
		writeSettingsStorage(list, function(){
			readSettingsStorage(readSettingsCallback);
		});
		} else {
			readSettingsCallback(items);
		}
	});
}

 function readSettingsCallback(items) {
 	var a = JSON.parse(items.gfgsettings);	
	a.filter(function(setting) {
		document.getElementById('textdec').value = setting.textdec;
		document.getElementById('opacity').value = setting.opacity;
		document.getElementById('removelinks').checked = setting.removelinks;
	});
}
	
function readSettingsStorage(callback){
	chrome.storage.sync.get('gfgsettings', function(items){
		callback(items);
	});
}

function writeSettingsStorage(data, callback){
	var writedata = JSON.stringify(data);
	chrome.storage.sync.set({'gfgsettings':writedata}, function() {
		if(callback) 
			callback();
	});
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('removelinks').addEventListener('change',saveOptions);
document.getElementById('textdec').addEventListener('change',saveOptions);
document.getElementById('opacity').addEventListener('change',saveOptions);