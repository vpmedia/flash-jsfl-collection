/*
Slice Bitmap Instance v1
Copyright © 2007 GGSHOW.NET
All Rights Reserved.

Author: Goh Lee Chuan a.k.a. Mr G.
Email: gg1980@gmail.com
Homepage: http://www.ggshow.net
*/
var gg_dialog = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/Slice Bitmap Instance.xml");
if (gg_dialog.dismiss == "accept") {
	var type = gg_dialog.t;
	var o = gg_dialog.o;
	var p = gg_dialog.p;
	var s = Number(gg_dialog.s);
	var l = Number(fl.getDocumentDOM().getSelectionRect().left);
	var t = Number(fl.getDocumentDOM().getSelectionRect().top);
	var r = Number(fl.getDocumentDOM().getSelectionRect().right);
	var b = Number(fl.getDocumentDOM().getSelectionRect().bottom);
	var w = Number(r-l);
	var h = Number(b-t);
	var h0 = Number(gg_dialog.h);
	var v0 = Number(gg_dialog.v);
	var w1 = Number(w/h0);
	var h1 = Number(h/v0);
	if ((fl.getDocumentDOM().selection.length != 1) || (fl.getDocumentDOM().selection[0].instanceType != "bitmap")) {
		alert("Error: You must select a bitmap instance.");
	} else if (isNaN(h0)||isNaN(v0)||h0<1||v0<1||h0>100||v0>100||isNaN(s)||s<0) {
		alert("Error: Invalid parameters.");
	} else {
		fl.getDocumentDOM().group();
		fl.getDocumentDOM().enterEditMode('inPlace');
		if (o=="mask") {
			var fill = fl.getDocumentDOM().getCustomFill();
			fill.color = 0xFF0000;
			fill.style = "solid";
			fl.getDocumentDOM().setCustomFill(fill);
			fl.getDocumentDOM().clipCut();
			for (var j = 0; j<v0; j++) {
				for (var i = 0; i<h0; i++) {
					var n = p+j+"_"+i;
					var k = 0;
					var n1 = n;
					while(fl.getDocumentDOM().library.itemExists(n1)){
						k++;
						n1 = n+"_"+k;
					}
					n = n1;
					fl.getDocumentDOM().clipPaste(true);
					fl.getDocumentDOM().convertToSymbol(type, n, 'top left');
					fl.getDocumentDOM().setTransformationPoint({x:(0.5+i)*w1, y:(0.5+j)*h1});
					fl.getDocumentDOM().enterEditMode('inPlace');
					fl.getDocumentDOM().getTimeline().addNewLayer();
					fl.getDocumentDOM().addNewRectangle({left:i*w1+l, top:j*h1+t, right:(i+1)*w1+l, bottom:(j+1)*h1+t}, 0, false, true);
					fl.getDocumentDOM().getTimeline().setLayerProperty('layerType', 'mask');
					fl.getDocumentDOM().getTimeline().setSelectedLayers(1, true);
					fl.getDocumentDOM().getTimeline().setLayerProperty('layerType', 'masked');
					fl.getDocumentDOM().exitEditMode();
					if (type == 'movie clip') {
						fl.getDocumentDOM().selection[0].name = n;
					}
					flash.getDocumentDOM().moveSelectionBy({x:i*s, y:j*s});
				}
			}
		} else if (o=="cut") {
			fl.getDocumentDOM().breakApart();
			for (var j = 0; j<v0; j++) {
				for (var i = 0; i<h0; i++) {
					var n = p+j+"_"+i;
					var k = 0;
					var n1 = n;
					while(fl.getDocumentDOM().library.itemExists(n1)){
						k++;
						n1 = n+"_"+k;
					}
					n = n1;
					fl.getDocumentDOM().setSelectionRect({left:w1*i+l, top:h1*j+t, right:w1*(i+1)+l, bottom:h1*(j+1)+t}, true, true);
					fl.getDocumentDOM().convertToSymbol(type, n, 'center');
					fl.getDocumentDOM().enterEditMode('inPlace');
					fl.getDocumentDOM().selectNone();
					fl.getDocumentDOM().getTimeline().setLayerProperty('locked', 'true');
					fl.getDocumentDOM().exitEditMode();
					if (type == 'movie clip') {
						fl.getDocumentDOM().selection[0].name = n;
					}
					flash.getDocumentDOM().moveSelectionBy({x:i*s, y:j*s});
					fl.getDocumentDOM().selection[0].locked = true;
				}
			}
			fl.getDocumentDOM().unlockAllElements();
		}
		fl.getDocumentDOM().exitEditMode();
		fl.getDocumentDOM().unGroup();
		var total = Number(v0*h0);
		alert("Slice bitmap instance (" + h0 + " x " + v0 + ") successful.\nTotal " + total + " " + type + " symbols created.");
	}
}
