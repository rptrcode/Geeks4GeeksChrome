var items_;
var settings_;

var container = $(document.createElement('div')).css({ 
"position":"fixed", "top":"95%", "right":"0%", "z-index":"9999",  
	"font-size": "12px", "cursor":"pointer","color":"white","padding": "5px 10px","font-weight":"bold"
});
container.attr('id','container');
container.css("background-color","green");	
container.text('Loading....');
console.log("gfg loading...");
$("body").append(container);

var docflag = true;
var doctimeout = setTimeout(init, 3000);

$(document).ready(function() {
	if(docflag==true){	
		clearTimeout(doctimeout);
		docflag=false;
		init();
	}
	$('.comments_main').detach();
});

$(window).on('focus', function() { init(); });
$("#container").click(function() { mark(); });

function init() {
	docflag = false;	
	// website customization
	$('#content').css("width","auto");
	$('#sidebar').detach();
	$('.blog-info').detach();
	$('#menu').detach();
	$('#navmenu').detach();
	$("#wrapper b h2 a").each(function() {
		//annoying top right corner link
		if((this.href) == "http://geeksquiz.com/"){
			this.remove();
		}
	});
	
	readstorage(function(items){
	if(typeof(items.gfg) == 'undefined') {
		var list = ["ok"];
		writestorage(list, function(){
			readstorage(doccallback);
		});
	} else {
		doccallback(items);
	}
	});
	
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

function readsettingscallback(items){
 	var a = JSON.parse(items.gfgsettings);	
	a.filter(function(settings) {
		settings_ = settings;
	});
	
	linethrough();
}	

function doccallback(items) {
	var a = JSON.parse(items.gfg);
	var l = document.URL;
	if (a.filter(function(p) {return p == l}).length > 0) {
		toggle(true);
	} else {
		toggle(false);
	}
	items_ = items;
}

var removedlinks_=0;

function linethrough() {
	var container = $('#container');
	var a = JSON.parse(items_.gfg);
	
	var readlinks=0;
	var unreadlinks=0;
	var pagecontent = false;

  if($("#content .post").length > 0){
	  //console.log("post content");
	  pagecontent = false;
	} else {
		//console.log("page content");
		pagecontent = true;
	}
	
	if(pagecontent) {
		//Remove link option should work only for aggregate pages and not for individual posts.
		$("#content .page-content a").each(function() {
			var link = this.href;
			if (a.filter(function(p) { return p == link }).length > 0) {
				if(settings_.removelinks){
					removedlinks_++;
					$(this).remove();
				} else {
					readlinks++;
					$(this).css("opacity", (settings_.opacity)/100);			
					$(this).css("text-decoration", settings_.textdec);
				}
			} else{
				unreadlinks++;
				$(this).css("text-decoration", "none");
				$(this).css("opacity", "1");			
			}
		});
		
		$("#container").off("click");
		container.css("cursor","default");
		var read = readlinks + removedlinks_;
		var unread = unreadlinks;
		var perc = Math.floor((read*100)/(read+unread));
		container.text(read+"("+(read+unread)+") "+perc+"%");
		if(perc>35){ //ok pass :D
			container.css("background-color","green");
		} else {
			container.css("background-color","red");
		}
	} else {
		$("#content #post-content a, #content .post-title a").each(function() {
			var link = this.href;
			if (a.filter(function(p) { return p == link }).length > 0) {
				readlinks++;
				$(this).css("opacity", (settings_.opacity)/100);			
				$(this).css("text-decoration", settings_.textdec);
			} else{
				unreadlinks++;
				$(this).css("text-decoration", "none");
				$(this).css("opacity", "1");			
			}
		});
	}
}

function mark() {
	if ($("#container").css("background-color")=="rgb(255, 0, 0)"){
		toggle(true);
		add();
	} else {
		toggle(false);
		remove();
	}
}

function toggle(val) {
 var container = $('#container');
	if(val==true){
 		container.text('Solved :)');
		container.css("background-color","green");
	}else{			  
		container.text('Solved ? ');
		container.css("background-color","red");
	}
}

function add() {
	readstorage(function(items) {
		var l = document.URL;
		var a = JSON.parse(items.gfg);
		if (a.filter(function(p) {return p == l}).length == 0) {
			a.push(l);
		}
		writestorage(a);
	});
}

function remove(l) {
	readstorage(function(items){
		var l = document.URL;
		var a = JSON.parse(items.gfg);
		if (a.filter(function(p) { return p == l }).length > 0) {
			var removed = jQuery.grep(a, function(p) {
				return p !== l;
			});
			writestorage(removed);
		}
	});
}

function readstorage(callback){
	chrome.storage.sync.get('gfg', function(items){
		callback(items);
	});
}

function writestorage(data, callback){
	var writedata = JSON.stringify(data);
	chrome.storage.sync.set({'gfg':writedata}, function() {
		if(callback)
			callback();
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


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.command=="importbg2main" && (typeof items_ !== "undefined")){
		var a = JSON.parse(items_.gfg);
		var b = JSON.parse(localStorage.getItem('gfgexport'));
		b.filter(function(param){
		if (a.filter(function(p) {return p == param}).length == 0) {
			a.push( param);
		}
		});
		writestorage(a, function() {
			init(); //read and linethrough all overa again
		});
	} else if(message.command=="exportbg2main" && (typeof items_ !== "undefined")){
		//needtofigureout for filewrite TBD
		if (typeof localStorage['gfgexport'] == 'undefined') {
        var list = [];
        localStorage.setItem('gfgexport', JSON.stringify(list));
    }
		var a = JSON.parse(items_.gfg);
		localStorage.setItem('gfgexport', JSON.stringify(a));
		window.open().document.write(JSON.stringify(a));
	} else if(message.command=="togglebg2main") {
		mark();
	}
});