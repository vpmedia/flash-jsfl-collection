var items = fl.getDocumentDOM().selection;
for(var i=0;i<items.length;i++)
{
//	fl.trace(items[i].name);
	//fl.trace("TEST");
	//fl.trace(items[i].libraryItem.name.split("/").pop().toString())
	//items[i].name=items[i].libraryItem.name.split("/").pop().toString();
	items[i].name = "burt_"+i.toString();
}