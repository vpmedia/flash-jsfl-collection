/**
 * Utils
 *
 * Generic utility functions used across all scripts.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

var Utils =
{
	INSTANCE_TIMELINE_ELEMENT : "instance",
	SHAPE_TIMELINE_ELEMENT : "shape",
	TEXTFIELD_TIMELINE_ELEMENT : "text",
	
	UNDEFINED_LIB_ITEM : "undefined",
	COMPONENT_LIB_ITEM : "component",
	MOVIECLIP_LIB_ITEM : "movie clip",
	GRAPHIC_LIB_ITEM : "graphic",
	BUTTON_LIB_ITEM : "button",
	FOLDER_LIB_ITEM : "folder",
	FONT_LIB_ITEM : "font",
	SOUND_LIB_ITEM : "sound",
	BITMAP_LIB_ITEM : "bitmap",
	COMPILED_CLIP_LIB_ITEM : "compiled clip",
	SCREEN_LIB_ITEM : "screen",
	VIDEO_LIB_ITEM : "video",

	STATIC_TEXTFIELD : "static",
	DYNAMIC_TEXTFIELD : "dynamic",
	INPUT_TEXTFIELD : "input",

	/**
	 * Analyses a library item's path name and determines if the path name follows the "tfn" format.
	 *
	 * @param p_pathName Library item's path name, e.g. "somefolder/textfields/tf12".
	 *
	 * @return Boolean.
	 */ 
	isTranslatableLibPathName : function(p_pathName)
	{
		if ( !p_pathName || p_pathName === "" )
		{
			return false;
		}

		var pathParts = p_pathName.split("/");
		var itemName = pathParts[pathParts.length-1];

		if ( itemName.indexOf("tf") != 0 )
		{
			return false;
		}

		var itemNameParts = itemName.split("tf");

		if ( itemNameParts.length != 2 )
		{
			return false;
		}

		var tfNum = itemNameParts[1];

		if ( isNaN(tfNum) )
		{
			return false;
		}

		return true;
	},

	/**
	 * Where a path name follows the "tfn" naming convention this function will extract the ID from
	 * a library item's path name. E.g. "somefolder/textfields/tf12" will be converted to "tf12".
	 *
	 * @param p_pathName Library item's path name, e.g. "somefolder/textfields/tf12".
	 *
	 * @return String, the translation ID or "!" if the "tfn" convention isn't followed.
	 */
	getIDByLibPathName : function(p_pathName)
	{
		if ( this.isTranslatableLibPathName(p_pathName) )
		{
			var pathParts = p_pathName.split("/");
		
			return pathParts[pathParts.length-1];
		}
		else
		{
			return "!"
		}
	},

	/**
	 * Determine if a MovieClip is a valid translatable item. To be a translatable the MovieClip's
	 * library name should follow the "tfn" format and should only contain one static TextField on
	 * one layer and in one frame.
	 *
	 * @param p_libItem Library item of type MovieClip.
	 * @param p_lib A reference to the item's associated library object.
	 *
	 * @return Boolean.
	 */
	isTranslatableMovieClip : function(p_libItem,p_lib)
	{
		var pathName = p_libItem.name;

		var type = p_lib.getItemType(pathName);
		var hasValidPathName = this.isTranslatableLibPathName(pathName);
		var id = this.getIDByLibPathName(pathName);

		if ( type != this.MOVIECLIP_LIB_ITEM )
		{
			if ( hasValidPathName ) Logger.log("Library item \""+pathName+"\" is not a MovieClip",Logger.WARNING);

			return false;
		}

		var tl = p_libItem.timeline;

		if ( tl.layers.length > 1 )
		{
			if ( hasValidPathName ) Logger.log("MovieClip library item \""+pathName+"\" has more than 1 layer",Logger.WARNING);

			return false;
		}

		if ( tl.layers[0].frames.length > 1 )
		{
			if ( hasValidPathName ) Logger.log("MovieClip library item \""+pathName+"\" has more than 1 frame",Logger.WARNING);

			return false;
		}

		if ( tl.layers[0].frames[0].elements.length == 0 )
		{
			if ( hasValidPathName ) Logger.log("MovieClip library item \""+pathName+"\" is empty",Logger.WARNING);

			return false;
		}

		if ( tl.layers[0].frames[0].elements.length > 1 )
		{
			if ( hasValidPathName ) Logger.log("MovieClip library item \""+pathName+"\" contains more than child symbol",Logger.WARNING);

			return false;
		}

		var element = tl.layers[0].frames[0].elements[0];

		if ( element.elementType != this.TEXTFIELD_TIMELINE_ELEMENT )
		{
			if ( hasValidPathName ) Logger.log("MovieClip library item \""+pathName+"\" does not contain a TextField",Logger.WARNING);

			return false;
		}

		if ( !hasValidPathName )
		{
			return false;
		}

		return true;
	},

	/**
	 * Determine if an item is present in a FLA library by passing in all or part of its name path.
	 *
	 * @param p_namePart Part or all of its name path, e.g. passing in "tf12" would still return
	 *                   true if the item was present in the library at "folder1/folder2/tf12".
	 * @param p_lib A reference to the library object to search.
	 *
	 * @return Boolean.
	 */
	isItemInLib : function(p_namePart,p_lib)
	{
		var numItems = p_lib.items.length;

		for ( var i=0; i<numItems; i++ )
		{
			var item = p_lib.items[i];

			if ( item.name.indexOf(p_namePart) > -1 )
			{
				return true;
			}
		}

		return false;
	},

	/**
	 * Tidy the library by moving library items to descriptively named folders and then removing
	 * any empty folders. MovieClips with a zero use count that aren't exported for AS are also
	 * removed.
	 *
	 * @param p_doc A reference to the associated FLA document.
	 *
	 * @return Void.
	 */
	tidyLibrary : function(p_doc)
	{
		var library = p_doc.library;
		
		// Create new folders:

		var mcFolderName = "movieclips";
		var textMCFolderName = "movieclips-text";
		var graphicsFolderName = "graphics";
		var bitmapsFolderName = "bitmaps";
		var componentsFolderName = "components";
		var buttonsFolderName = "buttons";
		var otherFolderName = "other";

		library.newFolder(mcFolderName);
		library.newFolder(textMCFolderName);
		library.newFolder(graphicsFolderName);
		library.newFolder(bitmapsFolderName);
		library.newFolder(componentsFolderName);
		library.newFolder(buttonsFolderName);
		library.newFolder(otherFolderName);

		// Move items to folders depending on their type:

		var i;
		var item;

		for ( i=0; i<library.items.length; i++ )
		{
			item = library.items[i];

			var destinationFolder;

			switch ( library.getItemType(item.name) )
			{
				case this.MOVIECLIP_LIB_ITEM:
					destinationFolder = this.isTranslatableLibPathName(item.name) ? textMCFolderName : mcFolderName;
					break;
				case this.GRAPHIC_LIB_ITEM:
					destinationFolder = graphicsFolderName;
					break;
				case this.BITMAP_LIB_ITEM:
					destinationFolder = bitmapsFolderName;
					break;
				case this.COMPONENT_LIB_ITEM:
				case this.COMPILED_CLIP_LIB_ITEM:
					destinationFolder = componentsFolderName;
					break;
				case this.BUTTON_LIB_ITEM:
					destinationFolder = buttonsFolderName;
					break;
				case this.FOLDER_LIB_ITEM:
					break;
				default:
					destinationFolder = otherFolderName;
					break;
			}

			if ( destinationFolder != undefined )
			{
				var moveSuccess = library.moveToFolder(destinationFolder,item.name,true);
			}
		}

		library.moveToFolder(textMCFolderName,mcFolderName+"/TranslatableTextMC",true);

		// Clean up any empty folders:

		this.deleteEmptyLibFolders(library);

		// Clean up any MovieClips that have a zero use count and aren't exported for AS:

		this.deleteUnusedSymbols(p_doc);
	},

	/**
	 * Deletes any unused symbols from the library.
	 *
	 * @param p_doc A reference to the document to tidy up.
	 *
	 * @return Void.
	 */
	deleteUnusedSymbols : function(p_doc)
	{
		var namesForDeletion = [];
		var i;

		for ( i=0; i<p_doc.library.items.length; i++ )
		{
			item = p_doc.library.items[i];

			var useCount = this.getUseCount(item.name,p_doc);
			var type = p_doc.library.getItemType(item.name);

			switch ( type )
			{
				case this.MOVIECLIP_LIB_ITEM:
				case this.BUTTON_LIB_ITEM:

					// Bug: linkageExportForAS being incorrectly reported as false in some FLAs
					// after saving on some machines?

					if ( !item.linkageExportForAS && useCount == 0 && item.name != "movieclips-text/TranslatableTextMC" )
					{
						namesForDeletion.push(item.name);
					}
					break;
				case this.GRAPHIC_LIB_ITEM:
				case this.BITMAP_LIB_ITEM:
					if ( useCount == 0 )
					{
						namesForDeletion.push(item.name);
					}
					break;
				default:
					break;
			}
		}

		for ( i=0; i<namesForDeletion.length; i++ )
		{
			p_doc.library.deleteItem(namesForDeletion[i]);
		}
	},

	/**
	 * Recurse through the timelines currently on stage to count the use count of the specified
	 * library item. Why isn't this in the API? >.<
	 *
	 * @param p_namePath Library name path of the item to search for.
	 * @param p_doc A reference to the document to search.
	 *
	 * @return Number, item's use count.
	 */
	getUseCount : function(p_namePath,p_doc)
	{
		p_doc.library.editItem(p_doc);

		var timeline = p_doc.getTimeline();
		var useCount = {count:0};

		parseTimeline(p_namePath,timeline,useCount);

		function parseTimeline(p_namePath,p_timeline,p_countObj)
		{
			var layers = p_timeline.layers;
			var numLayers = layers.length;

			for ( var i=0; i<numLayers; i++ )
			{
				var layer = layers[i];

				var frames = layer.frames;
				var numFrames = layer.frames.length;

				for ( var j=0; j<numFrames; j++ )
				{
					var frame = frames[j];
					var isKeyFrame = frame.startFrame == j;

					if ( isKeyFrame )
					{
						var elements = frame.elements;
						var numElements = elements.length;

						for ( var k=0; k<numElements; k++ )
						{
							var element = elements[k];
							var elementType = element.elementType;
							var libraryItem = element.libraryItem;
							
							if ( libraryItem )
							{
								if ( libraryItem.name == p_namePath )
								{
									p_countObj.count++;
								}

								if ( libraryItem.timeline )
								{
									parseTimeline(p_namePath,libraryItem.timeline,p_countObj);
								}
							}
						}
					}
				}
			}
		}

		return useCount.count;
	},

	/**
	 * Recursively remove all empty folders from the library no matter how deeply nested.
	 *
	 * @param p_lib A reference to the library object to tidy.
	 *
	 * @return Void.
	 */
	deleteEmptyLibFolders : function(p_lib)
	{
		while ( this.libHasEmptyFolders(p_lib) )
		{
			for ( var i=0; i<p_lib.items.length; i++ )
			{
				var item = p_lib.items[i];

				if ( p_lib.getItemType(item.name) == this.FOLDER_LIB_ITEM )
				{
					if ( this.isLibFolderEmpty(p_lib,item.name) )
					{
						p_lib.deleteItem(item.name);
					}
				}
			}
		}
	},

	/**
	 * Determine if a library folder has contents.
	 *
	 * @param p_lib A reference to the library object.
	 * @param p_folderName The folder path to search.
	 *
	 * @return Boolean.
	 */
	isLibFolderEmpty : function(p_lib,p_folderName)
	{
		var count = 0;

		for ( var i=0; i<p_lib.items.length; i++ )
		{
			var item = p_lib.items[i];

			if ( item.name.indexOf(p_folderName) > -1 )
			{
				count++;
			}

			if ( count > 1 )
			{
				break;
			}
		}

		return count < 2;
	},

	/**
	 * Determine if the library contains any empty folders at all.
	 *
	 * @param p_lib A reference to the library object to search.
	 *
	 * @return Boolean.
	 */
	libHasEmptyFolders : function(p_lib)
	{
		for ( var i=0; i<p_lib.items.length; i++ )
		{
			var item = p_lib.items[i];

			if ( p_lib.getItemType(item.name) == this.FOLDER_LIB_ITEM )
			{
				if ( this.isLibFolderEmpty(p_lib,item.name) )
				{
					return true;
				}
			}
		}

		return false;
	},

	/**
	 * Return a 32 character hexadecimal GUID, e.g. 21EC2020-3AEA-1069-A2DD-08002B30309D.
	 *
	 * @return GUID String.
	 */
	guid : function()
	{	
    	var s4 = function()
    	{
       		return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
    	};

    	return (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());
	},

	/**
	 * Return the current system time as a timestamp in the format [DD/MM/YYYY:HH:MM:SS].
	 *
	 * @return Timestamp String.
	 */
	getTimeStamp : function()
	{
		var now = new Date();

		var timeStamp = "["+this.zeroPad(now.getDate())+"/"+this.zeroPad(now.getMonth()+1)+"/"+now.getFullYear()+":";

		timeStamp += this.zeroPad(now.getHours())+":"+this.zeroPad(now.getMinutes()+1)+":"+this.zeroPad(now.getSeconds()+1)+"]";

		return timeStamp;
	},
	
	/**
	 * Zero pad a number less than 10 by converting it to a string a prefixing it with a "0".
	 *
	 * @param p_num Number to zero pad.
	 *
	 * @return Zero padded numerical string.
	 */
	zeroPad : function(p_num)
	{
		if ( p_num < 10 )
		{
			return "0"+p_num;
		}
		else
		{
			return p_num;
		}
	},

	/**
	 * Run through all TextFields present in the FLA (does not include TextFields in unused symbols
	 * in the library). For every TextField found push the associated object onto the returned
	 * array. An additional "id" property is added to the TextField's object.
	 *
	 * @param p_doc A reference to the FLA to search.
	 *
	 * @return Array of translatable TextField generic objects (fl.findObjectInDocByType type).
	 */
	getAllTranslatableTextFields : function(p_doc)
	{
		var data = [];
		var results = fl.findObjectInDocByType(this.TEXTFIELD_TIMELINE_ELEMENT,p_doc);

		for ( var i=0; i<results.length; i++ )
		{
			var o = results[i];

			var element = o.obj;
			var parent = o.parent;

			// Skip any dynamic or input TextFields, these are not supported.

			if ( element.textType == this.STATIC_TEXTFIELD )
			{
				if ( parent != undefined )
				{
					var mcWrapper = parent.obj;

					if ( this.isTranslatableMovieClip(mcWrapper.libraryItem,p_doc.library) )
					{
						var pathName = mcWrapper.libraryItem.name;
						var id = this.getIDByLibPathName(pathName);

						o.id = id;

						data.push(o);
					}
				}
			}
		}

		return data;
	},

	/**
	 * Returns all static TextFields that appear either on the root timeline or nested in parent
	 * symbols that also appear on the root timeline. Uses the fl.findObjectInDocByType function
	 * and filters the results for static TextFields only. Does not find TextFields contained in
	 * unused MovieClips.
	 *
	 * @param p_doc A reference to the document to search.
	 *
	 * @return Array of static TextField objects.
	 */
	getAllStaticTextFields : function(p_doc)
	{
		var results = fl.findObjectInDocByType(this.TEXTFIELD_TIMELINE_ELEMENT,p_doc);
		var data = [];

		for ( var i=0; i<results.length; i++ )
		{
			var o = results[i];
			var element = o.obj;

			if ( element.textType == this.STATIC_TEXTFIELD )
			{
				data.push(o);
			}
		}

		return data;
	},

	/**
	 * Generate an array of library items that are not on the current document's stage (or any 
	 * nested MovieClip) but are exported for AS.
	 *
	 * @param p_doc A reference to the document to search.
	 *
	 * @return Array of library items.
	 */
	getAllUnusedExportedSymbols : function(p_doc)
	{
		var library = p_doc.library;
		var items = library.items;
		var numItems = items.length;
		var data = [];
		
		for ( var i=0; i<numItems; i++ )
		{
			var item = items[i];
			var useCount = this.getUseCount(item.name,p_doc);

			if ( item.linkageExportForAS && useCount == 0 )
			{
				data.push(item);
			}
		}

		return data;
	},

	/**
	 * Attempts to load an FLA and logs an error if the FLA is not found.
	 *
	 * @param p_flaPath Full file path to the FLA.
	 *
	 * @return Boolean success value.
	 */
	loadFLA : function(p_flaPath)
	{
		if ( !FLfile.exists(p_flaPath) )
		{
			Logger.log("Error, target FLA not found",Logger.CRITICAL);

			return null;
		}
		else
		{
			return fl.openDocument(p_flaPath);
		}
	},

	/**
	 * Initialise the logger.
	 *
	 * @param p_config Reference to the main config object.
	 * @param p_scriptFileName String containing the filename of the currently executing JSFL.
	 *
	 * @return Void.
	 */
	initLogger : function(p_config,p_scriptFileName)
	{
		if ( !Logger )
		{
			return;
		}

		Logger.init(p_config.logToFile,p_config.logToIDE,p_config.logFilePath,p_config.jobID,p_scriptFileName);

		Logger.log("Script starting ...");

		var configString = "";

		for ( var i in p_config )
		{
			configString += "  "+i+" : "+p_config[i]+"\n";
		}

		configString = configString.slice(0,configString.length-2);

		Logger.log("Using config:\n"+configString);
	},

	/**
	 * Load an external XML file and parse it's contents into a E4X XML object.
	 *
	 * @param p_xmlFilePath Full file path to the XML.
	 *
	 * @return XML object.
	 */
	loadXML : function(p_xmlFilePath)
	{
		var xmlString = FLfile.read(p_xmlFilePath);

		// E4X can't handle the XML version and encoding declaration so strip it out if its present:

		xmlString = xmlString.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/,"");

		if ( xmlString )
		{
			try
			{
				return new XML(xmlString);
			}
			catch( p_error )
			{
				Logger.log("XML parse error. "+p_error,Logger.WARNING);

				return null;
			}
		}
		else
		{
			return null;
		}
	},

	/**
	 * Export an FLA as a SWF.
	 *
	 * @param p_swfFilePath File path to write the SWF.
	 * @param p_doc Reference to the FLA document to export.
	 *
	 * @return Boolean value indicating success.
	 */
	exportSWF : function(p_swfFilePath,p_doc)
	{
		p_doc.exportSWF(p_swfFilePath,true);

		if ( FLfile.exists(p_swfFilePath) )
		{
			return true;
		}
		else
		{

			return false;
		}
	},

	/**
	 * Iterates through the library and adds to the stage any MovieClips or Buttons that have been
	 * exported for AS but not placed on the stage DOM anywhere.
	 *
	 * @param p_doc A reference to the FLA to work on.
	 *
	 * @return Number, the index of the new layer added.
	 */
	addUnusedSymbolsToStage : function(p_doc)
	{
		var library = p_doc.library;

		library.editItem(p_doc);

		var root = p_doc.getTimeline();
		var tempLayerName = this.guid();
		var tempLayerIndex = root.addNewLayer(tempLayerName)
		var tempLayer = root.layers[tempLayerIndex];
		var unUsedSymbols = this.getAllUnusedExportedSymbols(p_doc);

		for ( i=0; i<unUsedSymbols.length; i++ )
		{
			p_doc.addItem({x:0,y:0},unUsedSymbols[i]);
		}

		return tempLayerIndex;
	},

	/**
	 * Run through the library and return all items that have a path name in the pattern "tfn".
	 * Results are returned as an array of objects containing a reference to the item and its id.
	 *
	 * @param p_doc A reference to the FLA to search.
	 *
	 * @return Array of translatable MovieClips.
	 */
	getAllTranslatableMovieClips : function(p_doc)
	{
		var library = p_doc.library;
		var movieClips = [];

		for ( var i=0; i<library.items.length; i++ )
		{
			item = library.items[i];

			if ( this.isTranslatableLibPathName(item.name) )
			{
				movieClips.push({mc:item,id:this.getIDByLibPathName(item.name),name:item.name});
			}
		}

		return movieClips;
	},

	/**
	 * Create a sprite-sheet style MovieClip containing all the translatable TextFields used in the
	 * FLA for easy access to all the TextFields.
	 *
	 * @param p_doc A reference to the current FLA.
	 *
	 * @return Void.
	 */
	createTextSheet : function(p_doc)
	{
		var sheetName = "TranslatableTextMC";
		var folderName = "movieclips-text";
		var fullPath = folderName+"/"+sheetName;
		var mcLibItems = this.getAllTranslatableMovieClips(p_doc);
		var library = p_doc.library;

		// Tidy library and create folder if needed:

		library.newFolder(folderName);
		library.deleteItem(sheetName);
		library.deleteItem(fullPath);

		// Exit function if there are no translatable TextFields present:

		if ( mcLibItems.length == 0 )
		{
			return;
		}

		// Sort the TextField array by ID so that "tf1" appears at the top of the layers:

		mcLibItems.sort(sortOnID);

		// Create a new MovieClip in the library and open it for editing:

		library.addNewItem("movie clip",fullPath);
		var holder = library.items[library.findItemIndex(fullPath)];
		library.editItem(fullPath);

		// Loop through all the TextFields and add their MovieClip holders to the new MovieClip's
		// timeline:

		var holderTimeline = p_doc.getTimeline();
		var mcElements = [];
		var i;

		for ( i=0; i<mcLibItems.length; i++ )
		{
			holderTimeline.addNewLayer(mcLibItems[i].id);

			library.addItemToDocument({x:0,y:0},mcLibItems[i].name);

			mcElements.push(holderTimeline.layers[0].frames[0].elements[0]);
		}

		// Delete the empty "Layer 1":

		for ( i=0; i<holderTimeline.layers.length; i++ )
		{
			if ( holderTimeline.layers[i].name == "Layer 1" )
			{
				holderTimeline.deleteLayer(i);
			}
		}

		// Layout the TextFields in a rough grid. Sort them by height first so the largest
		// TextFields appear near the bottom of the grid:

		var numCols = 3;
		var padding = 15;
		var heightArray = [];
		var xPos = 0;
		var yPos = 0;

		for ( i=0; i<mcElements.length; i++ )
		{
			var element = mcElements[i];
			
			element.x = xPos;
			element.y = yPos;

			heightArray.push(element.height);

			xPos += element.width + padding;

			if ( (i+1) % numCols == 0 )
			{
				xPos = 0;
				yPos += Math.max.apply(Math,heightArray)+padding;

				heightArray = [];
			}
		}

		// Local util functions:

		function sortOnID(p_a,p_b)
		{
			var aNum = parseInt(p_a.id.split("tf")[1]);
			var bNum = parseInt(p_b.id.split("tf")[1]);

			if ( aNum > bNum )
			{
				return 1;
			}
			else if ( aNum < bNum )
			{
				return -1;
			}
			else
			{
				return 0;
			}
		}
	},

	/**
	 * Convert a static TextField element to a string while preserving the formatting information in
	 * its textRuns array into an XML-like structure.
	 *
	 * @param p_tf A reference to the static TextField element.
	 *
	 * @return XML String.
	 */
	tfToXML : function(p_tf)
	{
		function wrapInTag(p_chars,p_attrs)
		{
			var startTag = "<textrun>";
			var endTag = "</textrun>";

			for ( var attr in p_attrs )
			{
				startTag = startTag.replace(/>/," "+attr+"=\""+p_attrs[attr]+"\">");
			}

			return startTag+p_chars+endTag;
		}

		function tagAttrsAreIdentical(p_a,p_b)
		{
			for ( var attr in p_a )
			{
				if ( p_a[attr] != p_b[attr] )
				{
					return false;
				}
			}

			return true;
		}

		var textRuns = p_tf.textRuns;
		var textRunTagAttrs = [];
		var xml = "";

		for ( var i=0; i<textRuns.length; i++ )
		{
			var textRun = textRuns[i];
			var chars = textRun.characters;

			chars = chars.replace(/\n/g,"<br/>");
			chars = chars.replace(/\r/g,"<br/>");

			var attrs = textRun.textAttrs;

			var tagAttrs =
			{
				face : attrs.face,
				size : attrs.size,
				bold : attrs.bold,
				italic : attrs.italic,
				colour : attrs.fillColor
			}

			if ( i > 0 )
			{
				if ( tagAttrsAreIdentical(tagAttrs,textRunTagAttrs[textRunTagAttrs.length-1]) )
				{
					xml = xml.substring(0,xml.length-"</textrun>".length);

					xml += chars+"</textrun>";
				}
				else
				{
					xml += wrapInTag(chars,tagAttrs);
				}
			}
			else
			{
				xml += wrapInTag(chars,tagAttrs);
			}

			textRunTagAttrs.push(tagAttrs);
		}

		return xml;
	},

	/**
	 * Set the contents of a static TextField via an XML string.
	 *
	 * @param p_xml XML String.
	 * @param p_tf A reference to a static TextField element.
	 *
	 * @return Void.
	 */
	xmlToTF : function(p_xml,p_tf)
	{
		// Replace <br/> and <br /> with \r carriage returns:

		p_xml = p_xml.replace(/<br \/>/g,"<br/>");
		p_xml = p_xml.replace(/<br\/>/g,"\r");

		// Parse the XML string with a SAX XML parser. The base tag-less string is built up
		// incrementally, and each time a <textrun> tag is encountered a matching attributes
		// object is created:

		var baseAttrs = p_tf.textRuns[0];
		var results = [];
		var resultString = "";

		HTMLParser(p_xml,
		{
			start : function(p_tag,p_attrs,p_unary )
			{
				switch (p_tag)
				{
					case "textrun":
						var size = getAttrValueByName(p_attrs,"size");
						var face = getAttrValueByName(p_attrs,"face");
						var fillColor = getAttrValueByName(p_attrs,"colour");
						var bold = getAttrValueByName(p_attrs,"bold");
						var italic = getAttrValueByName(p_attrs,"italic");
						results.push(
						{
							startIndex : resultString.length,
							endIndex : 0,
							size : isNaN(size) ? baseAttrs.size : size,
							face : !face ? baseAttrs.face : face,
							fillColor : !fillColor ? baseAttrs.fillColor : fillColor,
							bold : bold === undefined ? baseAttrs.bold : bold,
							italic : italic === undefined ? baseAttrs.italic : italic
						});
						break;
					default:
						Logger.log("Warning, unsupported XML tag <"+p_tag+"> found in the XML",Logger.WARNING);
						break;
				}
			},
			chars : function( p_text )
			{
				resultString += p_text;
			},
			end : function( p_tag )
			{
				var prevObj = getLastMember(results);
				if ( prevObj )
				{
					prevObj.endIndex = resultString.length;
				}
			}
		});
		
		// Set the contents on the TextField to be the raw tag-less string and then loop through the
		// constructed array of text attributes objects applying the styles at the proper indexes:

		p_tf.setTextString(resultString);

		for ( var i=0; i<results.length; i++ )
		{
			var o = results[i];
			var start = o.startIndex;
			var end = o.endIndex;

			p_tf.setTextAttr("face",o.face,start,end);
			p_tf.setTextAttr("size",o.size,start,end);
			p_tf.setTextAttr("fillColor",o.fillColor,start,end);
			p_tf.setTextAttr("bold",o.bold == "true" ? true : false,start,end);
			p_tf.setTextAttr("italic",o.italic == "true" ? true : false,start,end);
		}

		// Local util functions:

		function getLastMember(p_array)
		{
			if ( p_array.length == 0 )
			{
				return null;
			}
			else
			{
				return p_array[p_array.length-1];
			}
		}

		function getAttrValueByName(p_attrs,p_name)
		{
			for ( var i=0; i<p_attrs.length; i++ )
			{
				if ( p_attrs[i].name == p_name )
				{
					return p_attrs[i].value;
				}
			}

			return "";
		}

		function cloneTextAttrs(p_attrs)
		{
			var clone = {};

			for ( var i in p_attrs )
			{
				clone[i] = p_attrs[i];
			}

			return clone;
		}
	},

	/**
	 * Save an XML file to disk.
	 *
	 * @param p_filePath File path to save.
	 * @param p_xmlString String representing the XML data.
	 * @param p_unEspace Unescape the string by turning &lt; back into < etc.
	 * @param p_addEncoding Whether to add the XML version and encoding declaration at the top.
	 *
	 * @return Boolean indicating success or failure.
	 */
	saveXML : function(p_filePath,p_xmlString,p_unEscape,p_addEncoding)
	{
		if ( p_unEscape )
		{
			p_xmlString = p_xmlString.replace(/&lt;/g,"<");
			p_xmlString = p_xmlString.replace(/&gt;/g,">");
		}

		if ( p_addEncoding )
		{
			p_xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r"+p_xmlString;
		}

		return FLfile.write(p_filePath,p_xmlString);
	},

	/**
	 * Test to see if a text string contains only numbers and symbols.
	 *
	 * @param p_text String to test.
	 *
	 * @return Boolean.
	 */
	textIsTranslatable : function(p_text)
	{
		var regEx = /^[\!\@\#\$\%\^\&\*\(\)\|\\\/\,\.\~\`\-\=\+\_\±\§\"\n\r0-9]*$/;

		return !regEx.test(p_text);
	}
};