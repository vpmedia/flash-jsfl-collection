/**
 * Moves all selected items to 0,0
 */
var dom = fl.getDocumentDOM();
var newSel = [];
for(i=0;i<dom.selection.length;i++)
{
	var item = dom.selection[i];
	var mat = item.matrix;	
	mat.tx = 0;
	mat.ty = 0;
	item.matrix = mat;
	dom.setTransformationPoint({x:0, y:0});
}
dom.selectNone();