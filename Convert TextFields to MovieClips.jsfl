var dom = fl.getDocumentDOM();
var sel = dom.selection;
var selectionCount = sel.length;

for (var selectionIndex = 0; selectionIndex < selectionCount; selectionIndex++)
{
	var selectedItem = sel[selectionIndex];
	var currText = selectedItem.getTextString().toString();
	
	dom.selectNone();
	dom.selection = [sel[selectionIndex]];
	dom.convertToSymbol("movie clip", "\"" + currText.substr(0, 30) + "\"", "top left");
}

fl.outputPanel.trace("Conversion Complete!");