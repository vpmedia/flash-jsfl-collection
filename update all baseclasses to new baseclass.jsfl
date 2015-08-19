/**
 * Updates all movie clips in the library whos ExportClass matches
 * the target class, and updates it to the new one provided.
 */
var fld=fl.getDocumentDOM();
var lib=fld.library;
var items=lib.items;
var xmui=fld.xmlPanel(fl.configURI+"Commands/xmui/update all baseclasses to new baseclasses.xml");
if(xmui.dismiss=="accept")
{
	if(!xmui.currentBaseClass&&!xmui.newBaseClass)return;
	var k=items.length;
	var item;
	var i=0;
	for(i;i<k;i++)
	{
		item=items[i];
		if(item.linkageBaseClass==xmui.currentBaseClass)item.linkageBaseClass=xmui.newBaseClass;
	}
}