/**
 * Lock's all mask layers.
 */
var doc=fl.getDocumentDOM();
var tl=doc.getTimeline();
var layers=tl.layers;
for(var i=0;i<layers.length;i++)
{
	if(layers[i].layerType=="mask")
	{
		tl.setSelectedLayers(i,i);
		tl.setLayerProperty("locked",true,"selected");
		tl.setLayerProperty("visible",false,"selected");
	}
}