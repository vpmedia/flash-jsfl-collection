var win=fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/teknision/windows/changecase.xml");
if(win.dismiss=="accept"){
	
	//get text selection
	var doc=fl.getDocumentDOM();
	var textstr=doc.getTextString();
	var state=win.casestate;
	if(state=="u"){
		//uppercase
		var fstring=textstr.toUpperCase();
	}else if(state=="l"){
		//lowercase
		var fstring=textstr.toLowerCase();
	}else if(state=="m"){
		var strsplit=textstr.split(" ");
		var fstring="";
		for(var i=0;i<strsplit.length;i++){
			var atext=strsplit[i];
			var ntext=atext.charAt(0).toUpperCase()+(atext.substring(1,atext.length).toLowerCase());
			fstring+=ntext+" "
		}
	}else if(state=="ms"){
		var strsplit=textstr.split(".");
		var fstring="";
		for(var i=0;i<strsplit.length;i++){
			var atext=strsplit[i];
			if(atext.charAt(0)==" "){
				var ntext=" "+atext.charAt(1).toUpperCase()+(atext.substring(2,atext.length).toLowerCase());
			}else{
				var ntext=atext.charAt(0).toUpperCase()+(atext.substring(1,atext.length).toLowerCase());
			}
			if(i==strsplit.length-1){
				fstring+=ntext
			}else{
				fstring+=ntext+"."
			}
		}
	}
	doc.setTextString(fstring);
}