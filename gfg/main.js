

//global is bad... remove in nextv TBD
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

	docflag = false;	
	readstorage(initcallback);
}

function initcallback(items){
	if(typeof(items.gfg) == 'undefined') {
		var list = [{"url":"dummy"}];
		writestorage(list, function(){
			readstorage(doccallback);
		});
	} else {
		doccallback(items);
	}
}

function doccallback(items) {
	var a = JSON.parse(items.gfg);
	var l = document.URL;
	if (a.filter(function(p) {
		return p.url == l
	}).length > 0) {
		toggle(true);
	} else {
		toggle(false);
	}
	items_ = items;
	getbgsettings();
}

function getbgsettings(){
	 chrome.runtime.sendMessage({
			command: "getbgsettings"
	}, function(response) {
			if(response==null){
				settings_=[];
				settings_.textdec = "line-through";
				settings_.opacity = 30;
				settings_.removelinks = false;
				linethrough();
			} else {
					response.filter(function(param){
						settings_ = param;
						linethrough();
					});
			}
		});
}

function linethrough() {
	var container = $('#container');
	var readcnt=0;
	var unreadcnt=0;

	var a = JSON.parse(items_.gfg);

	$("#content .page-content a, #content #post-content a, #content .post-title a").each(function() {
		var link = this.href;
		if (a.filter(function(p) {
			return p.url == link
		}).length > 0) {
			if(settings_.removelinks)
				$(this).remove();
			else {
				$(this).css("opacity", (settings_.opacity)/100);			
				$(this).css("text-decoration", settings_.textdec);
			}
			readcnt++;
		} else{
			$(this).css("text-decoration", "none");
			$(this).css("opacity", "1");			
			unreadcnt++;
		}
	});
	if((readcnt+unreadcnt)>25){
		$("#container").off("click");
		container.css("cursor","default");	
		var perc = Math.floor((readcnt*100)/(readcnt+unreadcnt));
		container.text(readcnt+"("+(readcnt+unreadcnt)+") "+perc+"%");
		if(perc>25){
			container.css("background-color","green");
		} else {
			container.css("background-color","red");
		}
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
	readstorage(addcallback);
}
//just too many callbacks.. TBD
function addcallback(items) {
	var l = document.URL;
	var a = JSON.parse(items.gfg);
	if (a.filter(function(p) {return p.url == l}).length == 0) {
		a.push({url: l});
	}
	writestorage(a, function() {
	});
}

function remove(l) {
	readstorage(removecallback);
}

function removecallback(items){
	var l = document.URL;
	var a = JSON.parse(items.gfg);
	if (a.filter(function(p) {
			return p.url == l
	}).length > 0) {
			var removed = jQuery.grep(a, function(p) {
					return p.url !== l;
			});
		writestorage(removed);
	}
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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.command=="setbgitems2main" && (typeof items_ !== "undefined")){
		var a = JSON.parse(items_.gfg);
		var b = JSON.parse(message.data);
		b.filter(function(param){
		if (a.filter(function(p) {return p.url == param.url}).length == 0) {
			a.push({url: param.url});
		}
		});
		writestorage(a, function() {
			init(); //read and linethrough all overa again
		});
	} else if(message.command=="getbgitems2main" && (typeof items_ !== "undefined")){
			sendResponse(items_);
	} else if(message.command=="togglebg2main") {
			mark();
	}
});