Importer =
{
	config : {},

	/**
	 * Initiate import.
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

		var textFields;
		var xml;
		var translationData;
		var doc;
		var library;

		var flaSaved = false;
		var writeError = false;
		var applySuccess = false;

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

		library = doc.library;

		// Temporarily add unused/exported MovieClips to the stage:

		var tempLayerIndex = Utils.addUnusedSymbolsToStage(doc);

		// Gather translatable TextFields from the FLA:

		try
		{
			textFields = Utils.getAllTranslatableTextFields(doc);
		}
		catch (p_error)
		{
			Logger.log("Error gathering translatable TextFields from FLA. "+p_error,Logger.CRITICAL);

			return false;
		}

		Logger.log("Found "+textFields.length+" translatable TextFields in the FLA");

		if ( textFields.length == 0 )
		{
			Logger.log("No translatable TextFields found in the FLA",Logger.CRITICAL);

			return false;
		}

		// Load and parse the XML:

		xml = Utils.loadXML(this.config.xmlFilePath);

		if ( !xml )
		{
			Logger.log("Error laoding the XML",Logger.CRITICAL);

			return false;
		}

		try
		{
			translationData = this.parseXML(xml);
		}
		catch (p_error)
		{
			Logger.log("Error parsing the XML. "+p_error);
		}

		if ( translationData.items.length == 0 )
		{
			Logger.log("No translation data found in the XML",Logger.CRITICAL);

			return false;
		}

		// Attempt to apply the parsed translation data to the static TextFields found in the FLA:

		try
		{
			applySuccess = this.applyTranslations(textFields,translationData);
		}
		catch (p_error)
		{
			Logger.log("Error applying translation data to FLA. "+p_error,Logger.WARNING);

			return false;
		}

		if ( !applySuccess )
		{
			Logger.log("Error applying translation data to FLA.",Logger.WARNING);

			return false;
		}

		// Clean up the stage:

		library.editItem(doc);
		doc.getTimeline().deleteLayer(tempLayerIndex);

		// Create the TextField sprite sheet:

		try
		{
			Utils.createTextSheet(doc);
		}
		catch (p_error)
		{
			Logger.log("Warning, error creating the TextField sprite sheet. "+p_error,Logger.WARNING);
		}

		// Write the FLA and SWF to disk:

		flaSaved = fl.saveDocument(doc,this.config.outputFLAFilePath);

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

		// Close all open files:

		if ( p_closeAll ) fl.closeAll(false);

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
	 * Applies the translations found in the XML to the static TextFields found in the FLA.
	 *
	 * @param p_textFields Array of valid translatable TextField generic objects.
	 * @param p_translationData Object containing all the translation data.
	 *
	 * @return Boolean value indicating success or failure.
	 */
	applyTranslations : function(p_textFields,p_translationData)
	{
		var success = true;

		if ( p_textFields.length == 0 || p_translationData.items.length == 0 )
		{
			success = false;
		}

		if ( p_textFields.length != p_translationData.items.length )
		{
			Logger.log("Warning, mismatch between number of translatable TextFields in the FLA and in the XML.");

			success = false;
		}

		for ( var i=0; i<p_translationData.items.length; i++ )
		{
			var translationObj = p_translationData.items[i];
			var tfObj;
			var foundTF = false;

			for ( var j=0; j<p_textFields.length; j++ )
			{
				if ( p_textFields[j].id == translationObj.id )
				{
					foundTF = true;
					tfObj = p_textFields[j];

					break;
				}
			}

			if ( foundTF )
			{
				this.applyTranslationToTextField(translationObj,tfObj);
			}
			else
			{
				Logger.log("Warning, no TextField found for XML id \""+translationObj.id+"\"");

				success = false;
			}
		}

		Logger.log("Applied "+p_translationData.items.length+" translations onto "+p_textFields.length+" TextFields");

		return success;
	},

	/**
	 * Applies translation data to a TextField.
	 *
	 * @param p_translationObj Generic object containing XML derived translation data for a single item.
	 * @param p_tfObj Generic TextField object of the type returned by fl.getObjectsByType.
	 *
	 * @return Void.
	 */
	applyTranslationToTextField : function(p_translationObj,p_tfObj)
	{
		var text = p_translationObj.text;

		if ( this.config.importFormattedText )
		{
			Utils.xmlToTF(text,p_tfObj.obj);
		}
		else
		{
			p_tfObj.obj.setTextString(text);
		}
	},

	/**
	 * Parse the E4X XML object into generic JavaScript objects.
	 *
	 * @param XML object to parse.
	 *
	 * @return Object.
	 */
	parseXML : function(p_xml)
	{
		var o = {};

		o.lang = p_xml.@lang;

		Logger.log("XML has country code "+o.lang);

		o.items = [];

		var items = p_xml.items..item;

		Logger.log("Found "+items.length()+" translation items in the XML");

		for ( var i=0; i<items.length(); i++ )
		{
			var item = items[i];

			o.items.push
			(
				{
					id : item.@id,
					font : item.@font,
					size : item.@size,
					bold : item.@bold,
					italic : item.@italic,
					text : item.toString()
				}
			);
		}

		return o;
	}
}