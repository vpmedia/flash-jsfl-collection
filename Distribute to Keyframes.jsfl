/*
Distribute to Keyframes v1
Copyright © 2007 GGSHOW.NET
All Rights Reserved.

Author: Goh Lee Chuan a.k.a. Mr G.
Email: gg1980@gmail.com
Homepage: http://www.ggshow.net
*/
if (fl.getDocumentDOM().selection.length < 1) {
	alert("Error: No instance selected.");
} else {
	var count = fl.getDocumentDOM().selection.length;
	var shape = false;
	for(var i=0;i<count;i++){
		if(fl.getDocumentDOM().selection[i].elementType=="shape"){
			shape = true;
			break;
		}
	}
	if(shape){
		alert("Error: You are allowed to distribute only text field or symbol instances.");
	} else {
		document.clipCut();
		for(var i=0;i<count;i++){
			fl.getDocumentDOM().getTimeline().insertBlankKeyframe();
			document.clipPaste(true);
			fl.getDocumentDOM().selection[i].locked=true;
			document.deleteSelection();
			document.unlockAllElements();
		} 
	}
}
