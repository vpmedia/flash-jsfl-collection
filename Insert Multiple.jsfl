/*
Insert Multiple v1
Copyright © 2007 GGSHOW.NET
All Rights Reserved.

Author: Goh Lee Chuan a.k.a. Mr G.
Email: gg1980@gmail.com
Homepage: http://www.ggshow.net
*/
var gg_dialog = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/Insert Multiple.xml");
if (gg_dialog.dismiss == "accept") {
	var q = Number(gg_dialog.quantity);
	if ((isNaN(q))||(q<=0)) {
		alert("Error: Invalid parameter.\nThe value for quantity must be a positive integer.");
	} else {
		for(var i=1;i<=q;i++){
			switch(gg_dialog.frameType){
				case "frame":
					fl.getDocumentDOM().getTimeline().insertFrames();
					break;
				case "keyframe":
					fl.getDocumentDOM().getTimeline().insertKeyframe();
					break;
				case "blankkeyframe":
					fl.getDocumentDOM().getTimeline().insertBlankKeyframe();
					break;
				case "layer":
					fl.getDocumentDOM().getTimeline().addNewLayer();
					break;
			}
		}
	}
}