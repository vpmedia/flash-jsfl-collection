var doc = fl.getDocumentDOM();
var sel = doc.selection;

var itemCount = sel.length;
for (var itemIndex = 0; itemIndex < itemCount; itemIndex++)
{
	var item = sel[itemIndex];
	if (item.symbolType == "movie clip")
	{
		var newName = item.libraryItem.name;
		newName = newName.toLowerCase().split(" ").join("_").split(".").join("");
		doc.selectNone();
		doc.selection = [item];
		doc.setElementProperty("name", newName);
	}
}