/**
 * Processor.jsfl
 *
 * Not for direct use, these methods are called by other scripts.
 *
 * Takes an FLA as input and generates an XML file containing the text content ready for
 * translation. Static TextFields in a properly prepared FLA should each be wrapped in a MovieClip
 * named "tf1", "tf2" ... "tfn" in the library. The "tfn" library name becomes the text content's ID
 * in the XML file.
 * 
 * If any static TextFields are found in the FLA placed directly on the root timeline or on a
 * keyframe in a arbitrary MovieClip then this script will dynamically wrap such TextFields in an
 * appropriately named MovieClip before generating the XML. Dynamic and input TextFields are not
 * supported.
 *
 * If the outputFormattedText value is set to true the script will attempt to parse the style
 * information into XML tags for inclusion in the XML in CDATA sections, or if set to false the text
 * content is outputted as raw strings.
 *
 * The processed FLA and XML are then saved to the file paths specified.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

Processor =
{
	config : {},

	/**
	 * Initiate FLA processing.
	 * 
	 * @param p_doc A reference to a document to process or else a string specifying its filepath.
	 * @param p_config A reference to the config object.
	 * @param p_closeAll Boolean specifying whether to close all documents when the script exits.
	 * 
	 * @return Boolean indicating success or failure.
	 */
	go : function(p_doc,p_config,p_closeAll)
	{
		this.config = p_config;

		var xml;
		var data;
		var doc;

		if ( typeof(p_doc) == "string" )
		{
			doc = Utils.loadFLA(p_doc);
		}
		else
		{
			doc = p_doc;
		}

		if ( !doc )
		{
			Logger.log("Error opening document",Logger.CRITICAL);

			return false;
		}

		try
		{
			data = this.doProcessAndExport(doc);
		}
		catch (p_error)
		{
			Logger.log("Error processing FLA. "+p_error,Logger.CRITICAL);

			return false;
		}

		Logger.log("Generated "+data.length+" items for translation, converting to XML ...");

		try
		{
			Utils.tidyLibrary(doc);
		}
		catch (p_error)
		{
			Logger.log("Warning, error trying to tidy the library. "+p_error,Logger.WARNING);
		}

		try
		{
			Utils.createTextSheet(doc);	
		}
		catch (p_error)
		{
			Logger.log("Warning, error trying to create the text sheet MovieClip. "+p_error,Logger.WARNING);
		}

		try
		{
			xml = this.createXML(data);
		}
		catch (p_error)
		{
			Logger.log("Error generating XML. "+p_error,Logger.CRITICAL);

			return false;
		}

		var writeError = false;

		var xmlSaved = Utils.saveXML(this.config.outputXMLFilePath,xml.toXMLString(),true,true);

		if ( xmlSaved )
		{
			Logger.log("XML written to disk");
		}
		else
		{
			Logger.log("Error, can't save XML",Logger.WARNING);

			writeError = true;
		}

		var flaSaved = fl.saveDocument(doc,this.config.outputFLAFilePath);

		if ( flaSaved )
		{
			Logger.log("FLA written to disk");
		}
		else
		{
			Logger.log("Error, can't save FLA",Logger.WARNING);

			writeError = true;
		}

		var swfSaved = Utils.exportSWF(this.config.outputSWFFilePath,doc);

		if ( swfSaved )
		{
			Logger.log("SWF written to disk");
		}
		else
		{
			Logger.log("Error, can't save SWF",Logger.WARNING);

			writeError = true;
		}

		if ( p_closeAll )
		{
			fl.closeAll(false);
		}

		if ( writeError )
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	/**
	 * Process an FLA for translation. This involves parsing the contents of FLA for translatable
	 * static TextFields, wrapping them in a MovieClip if required and returning the data collection
	 * as an Array suitable for converting to XML.
	 *
	 * @return Array.
	 */
	doProcessAndExport : function (p_doc)
	{
		var data = [];
		var library = p_doc.library;
		var i;
		var tfObj;

		// Add to the root timeline any unused symbols that are exported for ActionScript to make sure
		// we include them in our processing. We'll delete this temporary layer later:

		var tempLayerIndex = Utils.addUnusedSymbolsToStage(p_doc);

		// Find all static TextFields. Analyse them to see if they're in the correct translatable format
		// and if required fix them (wrap them in a MovieClip):

		var staticTextFields = Utils.getAllStaticTextFields(p_doc);
		var validCount = 0;
		var invalidCount = 0;

		Logger.log("Found "+staticTextFields.length+" static TextFields in the FLA");

		for ( i=0; i<staticTextFields.length; i++ )
		{
			tfObj = staticTextFields[i];

			if ( tfObj.parent === undefined )
			{
				invalidCount++;

				this.fixInvalidTextFieldObject(tfObj,p_doc,this.getNextTFID(library));
			}
			else
			{
				if ( !Utils.isTranslatableMovieClip(tfObj.parent.obj.libraryItem,library) )
				{
					invalidCount++;

					this.fixInvalidTextFieldObject(tfObj,p_doc,this.getNextTFID(library));
				}
				else
				{
					validCount++;
				}
			}
		}

		Logger.log(validCount+" static TextFields were properly formatted");
		Logger.log(invalidCount+" static TextFields were improperly formatted and fixed");

		// Gather all translatable TextFields and generate the translation data:

		var translatableTextFields = Utils.getAllTranslatableTextFields(p_doc);

		Logger.log("Gathered "+translatableTextFields.length+" translatable TextFields");

		for ( i=0; i<translatableTextFields.length; i++ )
		{
			tfObj = translatableTextFields[i];

			var tfElement = tfObj.obj;
			var translationObj = {id:tfObj.id};

			if ( this.config.outputFormattedText )
			{
				translationObj.text = "<![CDATA["+Utils.tfToXML(tfElement)+"]]>";
			}
			else
			{
				// If we're not outputting HTML we want a clean unformatted string. Strip out any
				// carriage returns, newlines and replace any sequence of whitespaces with a single
				// space character:

				translationObj.text = tfElement.getTextString();
				translationObj.text = translationObj.text.replace(/\n/g," ");
				translationObj.text = translationObj.text.replace(/\r/g," ");
				translationObj.text = translationObj.text.replace(/\s{2,}/g," ");
			}

			data.push(translationObj);
		}

		// Sort the array:

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

		data.sort(sortOnID);

		// Clean up the stage and return the data:

		library.editItem(p_doc);
		p_doc.getTimeline().deleteLayer(tempLayerIndex);

		return data;
	},

	/**
	 * Compute the next available TextField ID.
	 *
	 * @param p_library Library object to analyse.
	 *
	 * @return String.
	 */
	getNextTFID : function (p_library)
	{
		var num = 1;

		while ( Utils.isItemInLib("tf"+num,p_library) )
		{
			num++;
		}

		return "tf"+num;
	},

	/**
	 * Where a static TextField is found on a timeline and not wrapped in a translatable MovieClip
	 * this method will attempt to dyncamically create a MovieClip and reparent the TextField into it.
	 *
	 * @param p_tfObj Generic TextField object as generated by fl.findObjectsByType.
	 * @param p_doc Reference to the current FLA document being worked on.
	 * @param p_id The desired ID of the new translatable MovieClip in the format "tfn".
	 *
	 * @return Void.
	 */
	fixInvalidTextFieldObject : function (p_tfObj,p_doc,p_id)
	{
		var library = p_doc.library;
		var element  = p_tfObj.obj;
		var parent = p_tfObj.parent;

		if ( parent === undefined )
		{
			library.editItem(p_doc);
		}
		else
		{
			library.editItem(parent.obj.libraryItem.name);
		}
		
		p_doc.selectNone();
		p_doc.getTimeline().currentFrame = p_tfObj.keyframe.startFrame;
		element.selected = true;

		var newMC = p_doc.convertToSymbol("movie clip",p_id,"top left");

		p_tfObj.parent = newMC;
	},

	/**
	 * Generate an E4X XML object from a data array in the format returned from the
	 * doProcessAndExport method.
	 *
	 * @param Data array from doProcessAndExport.
	 *
	 * @return XML object.
	 */
	createXML : function (p_data)
	{
		var xml = <root></root>;

		for ( var j in xml )
		{
			Logger.log(j);
		}

		xml.@lang = this.config.lang;
		xml.appendChild(<items></items>);

		var items = xml.items;

		for ( var i=0; i<p_data.length; i++ )
		{
			var item = <item></item>;

			item.appendChild(p_data[i].text);
			item.@id = p_data[i].id;

			items.appendChild(item);
		}

		return xml;
	}
};