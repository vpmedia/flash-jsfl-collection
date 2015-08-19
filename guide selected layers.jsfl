/**
 * Turn's all selected layers into guides.
 */
var layerArray=fl.getDocumentDOM().getTimeline().getSelectedLayers();
var a=0;
for(a;a<layerArray.length;a++)
{
	var numLayer=layerArray[a];
	var thisLayer=fl.getDocumentDOM().getTimeline().layers[numLayer];
	thisLayer.layerType="guide";
}