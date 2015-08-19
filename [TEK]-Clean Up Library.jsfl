if(!fl.getDocumentDOM()) {
	alert("Please open a file before using the Clean Up Designer Library command");
} else {
	
	///////////////////////////////////////////////////////////////
	// DATA HOLDERS
	var lib=fl.getDocumentDOM().library;
	var items=lib.items;

	var disalloweditems=new Array();
	var disallowednames=new Array();
	
	var libselitems=lib.getSelectedItems();
	
	
	
	///////////////////////////////////////////////////////////////
	//UI PATHS
	
	var win=fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/teknision/windows/Clean_Designer_Library.xml");
	
	
	if(win.dismiss=="accept"){
		
		///////////////////////////////////////////////////////////////
		//RETIREVE PROPS FROM UI
		
		if(win.ftitle==null){
			var sortfolder="OrganizedElements";
		}else{
			var sortfolder=win.ftitle;
		}
		
		if(win.utitle==null){
			var badfolder="UNNAMED";
		}else{
			var badfolder=win.utitle;
		}
		
		if(win.allowFolders=="false"){
			disalloweditems.push("folder");
		}
		
		if(win.unames!=null){
			var spl=win.unames.split(",");
			for(var x=0;x<spl.length;x++){
				disallowednames.push(spl[x]);
			}
		}

		fl.runScript(fl.configURI+"Commands/teknision/utilities/tekLibUtilities.jsfl","organizeFolder","",sortfolder,badfolder,disalloweditems,disallowednames);
	
	}
}

