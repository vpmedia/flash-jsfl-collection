// Funciton Communications | Fernando Flórez
// © www.funciton.com

// --- start of class definition

FuncitonOrderLibrary = function(){
}

var p = FuncitonOrderLibrary.prototype;

p.doc = fl.getDocumentDOM();

p.init = function(){
	if(!this.doc){
		alert ("You need to open a Flash File First");
	}else{
		this.lib = this.doc.library;
		var cItems = this.lib.items;
		for(var i=0;i<cItems.length;i++){
			var iType = this.lib.getItemType(cItems[i].name);
			if(iType != "folder" && iType != null && cItems[i].name.indexOf("/") == -1){
				var folderName = this.toFolderName(iType);
				if(!this.lib.itemExists(folderName)) this.lib.newFolder(folderName);
				this.lib.moveToFolder(folderName, cItems[i].name);
			}
		}
	}
}

p.toFolderName = function(str){
	var t = str.split(" ");
	for(var i=0;i<t.length;i++) t[i] = t[i].charAt(0).toUpperCase() + t[i].substr(1).toLowerCase();
	return t.join(" ");
}

// --- end of class definition

fl.outputPanel.clear();

var t = new FuncitonOrderLibrary();
t.init();