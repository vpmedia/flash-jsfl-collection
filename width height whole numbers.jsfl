/**
 * Rounds the width and height properties on all
 * selected objects.
 */
var objects=fl.getDocumentDOM().selection;
for(var i=0;i<objects.length;i++)
{
	objects[i].width=Math.round(objects[i].width);
	objects[i].height=Math.round(objects[i].height);
}