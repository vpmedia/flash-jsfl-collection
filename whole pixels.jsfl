/**
 * Moves selected objects on the stage to whole pixels
 */
var objects = fl.getDocumentDOM().selection;
for(var i = 0; i < objects.length; i++)
{
	objects[i].x = Math.round(objects[i].x);
	objects[i].y = Math.round(objects[i].y);
}