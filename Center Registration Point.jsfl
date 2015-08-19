var dom = fl.getDocumentDOM();
var selectionCount = dom.selection.length;

for (var selectionIndex = 0; selectionIndex < selectionCount; selectionIndex++)
{
	var selectedItem = fl.getDocumentDOM().selection[selectionIndex];
	selectedItem.setTransformationPoint({x:selectedItem.width / 2, y:selectedItem.height / 2});
}