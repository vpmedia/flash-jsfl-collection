/*
Scale To Stage v1
Copyright © 2007 GGSHOW.NET
All Rights Reserved.

Author: Goh Lee Chuan a.k.a. Mr G.
Email: gg1980@gmail.com
Homepage: http://www.ggshow.net
*/
var gg_dialog = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/Scale To Stage.xml");
var w1 = document.width-2*gg_dialog.margin;
var h1 = document.height-2*gg_dialog.margin;
var x1 = w1/document.width;
var y1 = h1/document.height;
if (gg_dialog.dismiss == "accept") {
	if (fl.getDocumentDOM().selection.length<=0) {
		alert("Error: No instance was selected.\nPlease select an instance before running this command.");
	} else if (isNaN(gg_dialog.margin)) {
		alert("Error: Invalid parameter.\nThe value for margin must be a number.");
	} else {
		fl.getDocumentDOM().match(true, false, true);
		fl.getDocumentDOM().match(false, true, true);
		fl.getDocumentDOM().scaleSelection(x1, y1);
		fl.getDocumentDOM().align('horizontal center', true);
		fl.getDocumentDOM().align('vertical center', true);
	}
}
