//
// Layer to Frame, Frame to Layer
//
// This command was made by Luar (luar@luar.net, http://www.luar.com.hk/)
//
var dom = fl.getDocumentDOM();
var xui = dom.xmlPanel(fl.configURI+"Commands/Layer Frame Distributer.xml");
var selectedFrame = dom.getTimeline().getSelectedFrames();
var sM = xui.switchMethod;
var isDelete = xui.isDelete;

if (xui.dismiss == "accept") {
	if (selectedFrame == "") {
		alert("No Frame is selected");
	} else {
		//fl.trace(selectedFrame);
		parseFrame(selectedFrame);
	}
}
function parseFrame(sf) {
	LayerA = new Array();
	startFrame = selectedFrame[1];
	endFrame = selectedFrame[2];
	for (var i = 0; i<selectedFrame.length; i=i+3) {
		LayerA.push(selectedFrame[i]);
	}
	/*fl.trace("isDelete: "+isDelete);
	fl.trace("sM: "+sM);
	fl.trace("startFrame: "+startFrame);
	fl.trace("endFrame: "+endFrame);
	fl.trace("LayerA: "+LayerA);*/
	if (sM<2) {
		if (LayerA.length<2 || endFrame-startFrame>1) {
			alert("Layer to Frame need at least 2 Layers and single frame is selected");
		} else {
			Layer2Frame();
		}
	} else if (sM>1) {
		if (LayerA.length>1 || endFrame-startFrame == 1) {
			alert("Frame to Layer need at least 2 Frames and single Layer is selected");
		} else {
			Frame2Layer();
		}
	}
}
function Layer2Frame() {
	dom.getTimeline().setSelectedLayers(LayerA[0]);
	dom.getTimeline().addNewLayer("NewLayer", "normal");
	newLayer = LayerA[0];
	if (sM == 0) {
		var startLayer = LayerA.length-1;
		var endLayer = 0;
		var dir = -1;
	} else {
		var startLayer = 0;
		var endLayer = LayerA.length-1;
		var dir = 1;
	}
	var count = 0;
	var i = startLayer;
	while (i != endLayer+dir) {
		dom.getTimeline().setSelectedLayers(LayerA[i]+1);
		dom.getTimeline().copyFrames(selectedFrame[3*count+1], selectedFrame[3*count+2]);
		dom.getTimeline().setSelectedLayers(newLayer);
		dom.getTimeline().pasteFrames(selectedFrame[1]+count, selectedFrame[2]+count+1);
		count++;
		i = i+dir;
	}
	if (isDelete == "true") {
		for (var i = LayerA.length-1; i>=0; i--) {
			dom.getTimeline().deleteLayer(LayerA[i]+1);
		}
	}
	dom.getTimeline().setSelectedFrames([]);
	dom.selectNone();
}
function Frame2Layer() {
	frameNo = selectedFrame[2]-selectedFrame[1];
	if (sM == 2) {
		var count = selectedFrame[1];
		var dir = 1;
	} else {
		var count = selectedFrame[2]-1;
		var dir = -1;
	}
	var i = 0;
	var layerFrameno = dom.getTimeline().frameCount;
	while (i<frameNo) {
		dom.getTimeline().setSelectedLayers(LayerA[0]);
		dom.getTimeline().copyFrames(count, count+1);
		dom.getTimeline().setSelectedLayers(LayerA[0]+i);
		dom.getTimeline().addNewLayer("NewLayer "+i, "normal", 0);
		dom.getTimeline().pasteFrames(selectedFrame[1], selectedFrame[1]+1);
		dom.getTimeline().removeFrames(selectedFrame[1]+1, layerFrameno);
		count = count+dir;
		i++;
	}
	if (isDelete == "true") {
		dom.getTimeline().deleteLayer(LayerA[0]);
	}
	dom.getTimeline().setSelectedFrames([]);
	dom.selectNone();
}
