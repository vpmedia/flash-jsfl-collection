/**
 * Toggle the lock option on selected layers.
 */
var layers = fl.getDocumentDOM().getTimeline().getSelectedLayers();
var i=0;
var l=layers.length;
for(i;i<l;i++)
{
	var layer = fl.getDocumentDOM().getTimeline().layers[i];
	layer.locked = !layer.locked;
}