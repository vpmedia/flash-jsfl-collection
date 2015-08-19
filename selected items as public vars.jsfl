/**
 * Creates an output of symbol definitions as public vars
 * and traces to the output panel.
 */
var items=fl.getDocumentDOM().selection;
var finalDeclarations="";
var li;
for(var i=0;i<items.length;i++)
{
	var item=items[i];
	if(item.libraryItem)
	{
		li=item.libraryItem;
		if(isComponent(item.libraryItem.name))finalDeclarations+="public var "+item.name+":"+getClassOfComponent(item.libraryItem.name)+";\n";
		else if(li.linkageBaseClass)finalDeclarations+="public var "+item.name+":"+(li.linkageBaseClass.toString().split(".").pop())+";\n";
		else if(item.name)finalDeclarations+="public var "+item.name+":MovieClip;\n";
	}
	else if(item.elementType=="text"&&item.name)finalDeclarations+="public var "+item.name+":TextField;\n";
}
function isComponent(libItemName){return libItemName.match(/Components\//i);}
function getClassOfComponent(libItemName){return libItemName.match(/Components\/([a-zA-Z0-9_-]*)/i)[1];}
fl.outputPanel.trace(finalDeclarations);