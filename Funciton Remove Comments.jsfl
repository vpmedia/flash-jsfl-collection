// Funciton Communications | Fernando Flórez
// © www.funciton.com

// --- start of class definition

FuncitonRemoveComments = function(){
}

var p = FuncitonRemoveComments.prototype;

p.doc = fl.getDocumentDOM();
p.trace = fl.outputPanel.trace;

p.init = function(){
	if(!this.doc){
		alert ("You need to open a Flash File First");
	}else{
		if(this.doc.selection.length){
			var sel = this.doc.selection;
			for(var i=0;i<sel.length;i++){
				if(sel[i].actionScript != null && sel[i].actionScript != "") sel[i].actionScript = this.removeComments(sel[i].actionScript);
			}
		}else if(this.doc.getTimeline().getSelectedFrames().length){
			var selFrames = this.doc.getTimeline().getSelectedFrames();
			var l = selFrames.length / 3;
			for(var i=0;i<l;i++){
				var sel = this.doc.getTimeline().layers[selFrames[(i*3)]].frames[selFrames[(i*3)+1]];
				if(sel.actionScript != null && sel.actionScript != "") sel.actionScript = this.removeComments(sel.actionScript);
			}
		}
	}
}

p.removeComments = function(txt){
	txt = this.removeMultiLineComments(txt);
	txt = this.removeOneLineComments(txt);
	return txt;
}

p.removeOneLineComments = function(txt){
	var actionScriptLines = txt.split("\n");
	for(var i=0;i<actionScriptLines.length;i++){
		var temp = actionScriptLines[i].indexOf("//");
		if(temp != -1 && actionScriptLines[i].charAt(temp-1) != "\"") actionScriptLines[i] = actionScriptLines[i].substring(0, (temp-1));
	}
	return actionScriptLines.join("\n");
}

p.removeMultiLineComments = function(txt){
	var sIndex = 0;
	while(txt.indexOf("/*", sIndex) != -1){
		if(txt.charAt(txt.indexOf("/*", sIndex)-1) != "\""){
			var t = "";
			sIndex = txt.indexOf("/*", sIndex);
			t = txt.substring(0, sIndex);
			t += txt.substring(txt.indexOf("*/", sIndex)+2);
			txt = t;
		}else{
			sIndex = txt.indexOf("/*", sIndex);
		}
	}
	return txt;
}

// --- end of class definition

fl.outputPanel.clear();

var t = new FuncitonRemoveComments();
t.init();