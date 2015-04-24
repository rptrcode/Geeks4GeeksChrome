
function save_options() {
  var textdecval = document.getElementById('textdec').value;
  var opacityval = document.getElementById('opacity').value;
  var removelinksval = document.getElementById('removelinks').checked;
	var settings = [{textdec:textdecval, opacity:opacityval, removelinks:removelinksval}];
	writesettingsstorage(settings);
}

function init() {
	readsettingsstorage(function (items) {
		if(typeof(items.gfgsettings) == 'undefined') {
		var list = [{"textdec":"line-through", "opacity":30, "removelinks":false}];
		writesettingsstorage(list, function(){
			readsettingsstorage(readsettingscallback);
		});
		} else {
			readsettingscallback(items);
		}
	});
}

 function readsettingscallback(items) {
 	var a = JSON.parse(items.gfgsettings);	
	a.filter(function(setting) {
		document.getElementById('textdec').value = setting.textdec;
		document.getElementById('opacity').value = setting.opacity;
		document.getElementById('removelinks').checked = setting.removelinks;
	});
}
	
function readsettingsstorage(callback){
	chrome.storage.sync.get('gfgsettings', function(items){
		callback(items);
	});
}

function writesettingsstorage(data, callback){
	var writedata = JSON.stringify(data);
	chrome.storage.sync.set({'gfgsettings':writedata}, function() {
		if(callback) 
			callback();
	});
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('removelinks').addEventListener('change',save_options);
document.getElementById('textdec').addEventListener('change',save_options);
document.getElementById('opacity').addEventListener('change',save_options);