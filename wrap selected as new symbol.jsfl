/**
 * Wraps all selected items in the library in a movie
 * clip, with registration point set to 0,0.
 */
ConvertAllToClips = function(){}
var proto = ConvertAllToClips.prototype;
proto.doc = fl.getDocumentDOM();
proto.init = function()
{
	if(xmui.dismiss == "accept")
	{
		this.lib = this.doc.library;
		var cItems = this.lib.getSelectedItems();
		var cLength = cItems.length;
		
		//add a temporary clip to the library in which conversion takes place:
		this.lib.addNewItem("movie clip", "_tmpConversionClip");
		this.lib.editItem("_tmpConversionClip");
		
		//put selected library items to stage:
		for(var i = 0; i < cLength; i++)
		{
			//this.lib.selectItem(cItems[i].name);
			this.lib.addItemToDocument({x:0, y:0}, cItems[i].name);
		}
		
		//select all items:
		this.doc.selectNone();
		this.doc.selectAll();
		this.doc.distributeToLayers();

		//delete the first layer, it's empty now:
		this.doc.getTimeline().deleteLayer(0);
			
		//get all layers again:
		var currentLayers = this.doc.getTimeline().layers;
		
		//first lock all layers:
		var i = 0;
		for(i in currentLayers)
		{
			currentLayers[i].locked = true;
		}
			
		//create folder:
		this.lib.newFolder(xmui.folderName);
			
		//then unlock layer by layer, convert, then lock again:
		var j = 0;
		var cl = currentLayers.length; // use backwards counting value for layers so item order stays correct.
		for(j in currentLayers)
		{
			cl--;
			if(!currentLayers[cl])
			{
				fl.trace("NOT HERE");
				break;
			}
			currentLayers[cl].locked = false;
			this.doc.selectNone();
			this.doc.selectAll();

			//check if leading zeroes should be used:
			if (xmui.leadingZeroes == "true")
			{
				//check how many zeroes are actually needed:
				var tmpLength = currentLayers.length;
				if(tmpLength < 100)
				{
					if(j < 10) var lz = "0";
					else if(j >= 10) var lz = "";
				}
				else if(tmpLength >= 100 && tmpLength < 1000)
				{
					if (j < 10) var lz = "00";
					else if (j >= 10 && j < 100) var lz = "0";
					else if (j >= 100) var lz = "";
				}
				else if (tmpLength >= 1000)
				{
					if (j < 10) var lz = "000";
					else if (j >= 10 && j < 100) var lz = "00";
					else if (j >= 100 && j < 1000) var lz = "0";
					else if (j >= 1000) var lz = "";
				}
			}
			else
			{
				var lz = "";
			}
			
			//finally convert selected item:
			this.doc.convertToSymbol(xmui.itemType, xmui.itemName + lz + j, xmui.regPoint);
			this.lib.moveToFolder(xmui.folderName);
			this.doc.getTimeline().deleteLayer();
		}
		
		//delete the rest:
		this.doc.selectNone();
		this.doc.selectAll();
		if(this.doc.selection.length > 0) this.doc.deleteSelection();
		this.doc.exitEditMode();
		this.lib.deleteItem("_tmpConversionClip");
	}
}
var theDoc = fl.getDocumentDOM();
if (!theDoc) alert("You need to open a Flash file first!");
else
{
	if(theDoc.library.getSelectedItems().length <= 1) alert("Please select at least two items in the library!");
	else
	{
		var xmui = theDoc.xmlPanel(fl.configURI + "Commands/xmui/wrap selected as new symbol.xml");
		var obj = new ConvertAllToClips();
		obj.init();
	}
}