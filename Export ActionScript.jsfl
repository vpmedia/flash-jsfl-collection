var dom = fl.getDocumentDOM();

// AScript definition
function AScript(code, timeline, layer, frame, isScene){
	this.code = code;
	this.timeline = timeline;
	this.layer = layer;
	this.frame = frame;
	this.isScene = isScene;
	
	this.id = "script:"+this.timeline+"."+this.layer+"."+this.frame;
	this.title = AScript.timelines[this.timeline].name+': '+AScript.timelines[this.timeline].layers[this.layer].name+', frame '+(this.frame + 1);
}
AScript.prototype.toString = function(){
	return this.code;
}
AScript.scripts = new Array();
AScript.timelines = new Array();
AScript.addScript = function(code, timeline, layer, frame, isScene){
	AScript.scripts.push(new AScript(code, timeline, layer, frame, isScene));
}

function parseCode() {
	// main timeline timelines
	var sceneCount = dom.timelines.length;
	AScript.timelines = AScript.timelines.concat(dom.timelines);

	// library timelines
	var items = dom.library.items;
	var n = items.length;
	var i = 0;
	while (i < n){
		if (items[i].itemType == "movie clip") {
			AScript.timelines.push(items[i].timeline);
		}
		i++;
	}
	
	// get code
	var li, fi;
	var ln, fn;
	var as;
	var n = AScript.timelines.length;
	var i = 0;
	while (i < n) {
		ln = AScript.timelines[i].layers.length;
		li = 0;
		while (li < ln) {
			fn = AScript.timelines[i].layers[li].frames.length;
			fi = 0;
			while (fi < fn) {
				as = AScript.timelines[i].layers[li].frames[fi].actionScript;
				if (as) {
					AScript.addScript(as, i, li, fi, (i < sceneCount));
				}
				fi += AScript.timelines[i].layers[li].frames[fi].duration;
			}
			li++;
		}
		i++;
	}
}


function generateTOC() {
	// table of contents
	var str = "";
	str += '<ul>\n'+
	'	<li><h5>Scenes:</h5>\n'+
	'		<ul>\n';
	var n = AScript.scripts.length;
	var i = 0;
	while (i < n){
		if (AScript.scripts[i].isScene) {
			str += '			<li><a href="#'+AScript.scripts[i].id+'">'+AScript.scripts[i].title+'</a></li>\n';
		}
		i++;
	}
	str += '		</ul>\n'+
	'	</li>\n'+
	'	<li><h5>Symbols:</h5>\n'+
	'		<ul>\n';
	n = AScript.scripts.length;
	i = 0;
	while (i < n){
		if (!AScript.scripts[i].isScene) {
			str += '			<li><a href="#'+AScript.scripts[i].id+'">'+AScript.scripts[i].title+'</a></li>\n';
		}
		i++;
	}
	str += '		</ul>\n'+
	'	</li>\n'+
	'</ul>\n'
	return str;
}

function generateContent() {
	// actionscripts
	var str = "";
	var n = AScript.scripts.length;
	var i = 0;
	while (i < n){
		str += formatScript(AScript.scripts[i]);
		i++;
	}
	return str;
}

function formatScript(script){
	// individual scripts
	return ''+
	'<div class="script">\n'+
	'	<h4 class="scriptTitle"><a name="'+script.id+'">'+script.title+'</a></h4>\n'+
	'	<pre class="code">'+replaceEntities(script.code)+'</pre>\n'+
	'</div>\n';
}
function replaceEntities(str){
	return str.replace(/&/g,"&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function init(){
	var saveFile = fl.browseForFileURL("save", "Save File");
	if (saveFile) {
		var templateFile = fl.configURI + "Commands/Export ActionScript/template.html";
		var str = FLfile.read(templateFile);
		parseCode();
		str = str.replace(/%%title%%/g, dom.name);
		str = str.replace(/%%toc%%/g, generateTOC());
		str = str.replace(/%%content%%/g, generateContent());
		FLfile.write(saveFile, str);
	}
}

init();