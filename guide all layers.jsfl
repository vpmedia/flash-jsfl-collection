/**
 * Guide all layers except masks.
 */
var doc=fl.getDocumentDOM();
var tl=doc.getTimeline();
var layers=tl.layers;
for(var i=0;i<layers.length;i++)
{
	if(layers[i].layerType=="mask")continue;
	else layers[i].layerType="guide";
}