/*
var xui = fl.getDocumentDOM().xmlPanel(fl.configURI + "Commands/symbol_type.xml");
if(xui){
	fl.outputPanel.trace(xui.type.value);
}
*/
var SymbolType = "movieclip";

var theLibrary = fl.getDocumentDOM().library;
var selectedItems = theLibrary.getSelectedItems();
fl.outputPanel.clear();
for(var itemIndex=0; itemIndex < selectedItems.length; itemIndex++){
	var theItem = selectedItems[itemIndex];
	var itemName = theItem.name;
	var itemDirectoryArray = itemName.split("/");
	var itemNameNoDir = itemDirectoryArray[itemDirectoryArray.length-1];
	var newItemName = itemName.split(".")[0];
	var newItemNameNoDir = itemNameNoDir.split(".")[0];
	var newItem = theLibrary.addNewItem(SymbolType, newItemName);
	theLibrary.editItem(newItemName);
	fl.getDocumentDOM().addItem({x:0,y:0}, theItem);
	var sel = fl.getDocumentDOM().selection[0];
	sel.x = 0;
	sel.y = 0;
	var outputString = "Convert \"" + itemNameNoDir + "\" to \"" + newItemNameNoDir + "\"";
	fl.outputPanel.trace(outputString);
}
fl.outputPanel.trace("Conversion Complete!");
fl.getDocumentDOM().currentTimeline = 0;