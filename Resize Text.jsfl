/*
Resize Text v1
Copyright © 2007 GGSHOW.NET
All Rights Reserved.

Author: Goh Lee Chuan a.k.a. Mr G.
Email: gg1980@gmail.com
Homepage: http://www.ggshow.net
*/
var gg_dialog = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/Resize Text.xml");
if (gg_dialog.dismiss == "accept") {
	var w = Number(gg_dialog.w);
	var h = Number(gg_dialog.h);
	if ((fl.getDocumentDOM().selection.length != 1) || (fl.getDocumentDOM().selection[0].elementType != 'text')) {
		alert("Error: You must select a text field instance.");
	} else if (isNaN(w)||isNaN(h)) {
		alert("Error: Invalid parameters.");
	} else {
		var l = Number(fl.getDocumentDOM().getSelectionRect().left);
		var t = Number(fl.getDocumentDOM().getSelectionRect().top);
		var r = Number(fl.getDocumentDOM().getSelectionRect().right);
		var b = Number(fl.getDocumentDOM().getSelectionRect().bottom);
		var r1 = l+w-2;
		var b1 = t+h-2;
		fl.getDocumentDOM().setTextRectangle({left:l, top:t, right:r1, bottom:b1});
	}
}