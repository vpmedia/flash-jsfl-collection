for(selectionIndex=0; selectionIndex<fl.getDocumentDOM().selection.length; selectionIndex++){
	var selectedItem = fl.getDocumentDOM().selection[selectionIndex];
	var currText = selectedItem.getTextString().toString();
	var newText = currText.toUpperCase();
	selectedItem.setTextString(newText);
}