fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
doc.zoomFactor = 8;
doc.clipCopy();
doc.getTimeline().addNewLayer("Original", "normal", false);
doc.clipPaste(true);
doc.getTimeline().layers[doc.getTimeline().currentLayer].layerType = "guide";
doc.getTimeline().layers[doc.getTimeline().currentLayer].locked = true;
doc.getTimeline().layers[doc.getTimeline().currentLayer].visible = false;
doc.getTimeline().setSelectedLayers(0);
doc.getTimeline().setSelectedFrames(0, 0);

doc.breakApart();
var break1Sel = doc.selection;
doc.selectNone();
var count = break1Sel.length;
var lib = doc.library;

var RTSOFolderName = "RTSO_Objects";
lib.newFolder(RTSOFolderName);

var tempArray = [];

for (var i = 0; i < count; i++)
{
	doc.selectNone();
	var letterSel = break1Sel[i];
	doc.selection = [letterSel];

	doc.clipCopy();
	doc.selectNone();

	var theLetter = letterSel.getTextString();
	if (theLetter == "/") theLetter = "(slash)";
	var cX = letterSel.x;
	var cY = letterSel.y;
	var cWidth = letterSel.width;
	var cHeight = letterSel.height;
	var cColor = letterSel.getTextAttr("fillColor");
	var cSize = letterSel.getTextAttr("size");
	var cFont = letterSel.getTextAttr("face");
	var cBold = letterSel.getTextAttr("bold");
	var cItalic = letterSel.getTextAttr("italic");
	var theCase = (isLowerCase(theLetter) == true) ? ("l") : ("u");
	var instanceName = cFont.split(" ").join("") + "_" + theLetter + "(" + theCase + ")" + ((cBold) ? ("_bold") : ("")) + ((cItalic) ? ("_italic") : (""));
	//var instanceName = cFont.split(" ").join("") + "_" + theLetter + "(" + theCase + ")_" + cSize + ((cBold) ? ("_bold") : ("")) + ((cItalic) ? ("_italic") : (""));
	
	doc.getTimeline().addNewLayer(instanceName, "normal", true);
	doc.clipPaste();
	var newSel = doc.selection;

	doc.selectNone();

	newSel[0].x = cX;
	newSel[0].y = cY;
	doc.selection = newSel;
	doc.breakApart();
	
	doc.getTimeline().setSelectedLayers(doc.getTimeline().currentLayer);
	doc.getTimeline().setSelectedFrames(0, 0);
	
	var myRect = doc.getSelectionRect();
	
	tempArray.push([myRect.left, myRect.top, doc.selection[0].width, doc.selection[0].height, cColor.split("#").join("")]);
}

for (var i = 0; i < count; i++)
{
	var lay = doc.getTimeline().layers[i];
	doc.getTimeline().setSelectedLayers(i);
	doc.getTimeline().setSelectedFrames(0, 0);
	
	if (lib.itemExists(RTSOFolderName + "/" + lay.name) == false)
	{
		doc.convertToSymbol("graphic", lay.name, "top left");
		lib.moveToFolder(RTSOFolderName, lay.name, true);
	}
	else
	{
		doc.deleteSelection();
		lib.addItemToDocument({x:tempArray[i][0] + (tempArray[i][2]/2), y:tempArray[i][1] + (tempArray[i][3]/2)}, RTSOFolderName + "/" + lay.name);
		var sel = doc.selection[0];
		sel.width = tempArray[i][2];
		sel.height = tempArray[i][3];
		var r = parseInt(tempArray[i][4].substr(0, 2), 16);
		var g = parseInt(tempArray[i][4].substr(2, 2), 16);
		var b = parseInt(tempArray[i][4].substr(4, 2), 16);
		sel.colorMode = "tint";
		sel.colorRedPercent = 0;
		sel.colorGreenPercent = 0;
		sel.colorBluePercent = 0;
		sel.colorRedAmount = r;
		sel.colorGreenAmount = g;
		sel.colorBlueAmount = b;
	}
}

doc.getTimeline().deleteLayer(doc.getTimeline().layers.length - 2);
doc.selectAll();
doc.clipCut();
doc.getTimeline().currentLayer = doc.getTimeline().layers.length - 2;
doc.getTimeline().currentFrame = 0;
doc.clipPaste(true);
doc.getTimeline().layers[doc.getTimeline().layers.length - 2].name = "Working layer";

var count = doc.getTimeline().layers.length;
fl.trace(count);
doc.selectNone();
for (var i = 0; i < count - 2; i++)
{
	doc.getTimeline().deleteLayer(0);
}

doc.zoomFactor = 1;
alert("Done");

function isLowerCase(aLetter)
{
	if (aLetter == aLetter.toLowerCase()) return true;
}
