
function save_options() {
  var textdecval = document.getElementById('textdec').value;
  var opacityval = document.getElementById('opacity').value;
  var removelinksval = document.getElementById('removelinks').checked;
	var settings = [{textdec:textdecval, opacity:opacityval, removelinks:removelinksval}];
	writestorage(settings);
	
	 chrome.runtime.sendMessage({
			command: "setbgsettings",
			data: settings
	}, function(response) {
});
}

function init() {
	readstorage(initcallback);
}

function initcallback(items){
	if(typeof(items.gfgsettings) == 'undefined') {
		var list = [{"textdec":"line-through", "opacity":30, "removelinks":false}];
		writestorage(list);
		setTimeout(function(){
			readstorage(readcallback);
		}, 5000);
	} else {
		readcallback(items);
	}
}

 function readcallback(items) {
 	var a = JSON.parse(items.gfgsettings);	
	a.filter(function(setting) {
		document.getElementById('textdec').value = setting.textdec;
		document.getElementById('opacity').value = setting.opacity;
		document.getElementById('removelinks').checked = setting.removelinks;
	});
}
	
function readstorage(callback){
	chrome.storage.sync.get('gfgsettings', function(items){
		callback(items);
	});
}

function writestorage(data){
	var writedata = JSON.stringify(data);
	chrome.storage.sync.set({'gfgsettings':writedata}, function() {
	});
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('removelinks').addEventListener('change',save_options);
document.getElementById('textdec').addEventListener('click',save_options);
document.getElementById('opacity').addEventListener('click',save_options);