/**
 * Unlocks all layers.
 */
var i=0;
var l=fl.getDocumentDOM().getTimeline().layers.length;
for(i;i<l;i++)
{
	var layer = fl.getDocumentDOM().getTimeline().layers[i];
	layer.locked = false;
}