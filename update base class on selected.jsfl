/**
 * Prompts for a new base class, that will be set
 * on all selected items in the library.
 */
var newBaseClass=prompt("Enter the new base class","");
if(newBaseClass)
{
	var items=fl.getDocumentDOM().library.getSelectedItems();
	var i=0;
	for(i;i<items.length;i++)
	{
		var item=items[i];
		var t=item.itemType;
		if(t!="movie clip"&&t!="font"&&t!="sound"&&t!="bitmap")continue;
		item.linkageExportForAS=true;
		item.linkageBaseClass=newBaseClass;
		item.linkageExportInFirstFrame=true;
	}
}