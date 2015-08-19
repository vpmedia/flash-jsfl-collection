/**
 * Replaces text in class definitions within a FLA. When run
 * two prompts will appear to specify search and replace text.
 * Once entered, all class definitions including the document
 * class, library item classes, and library base classes will
 * be searched for the specified text and replaced with the
 * respective text using a replace regular expression. After
 * the command has completed, an alert will appear providing
 * a report of the results.
 */
function replaceClassText(){
	
	// get search and replace text from the user
	// if the prompt is canceled, abort command
	var userFindText = prompt("Library class text to find", "");
	if (!userFindText) {
		fl.trace("User canceled command.");
		return;
	}
	var userReplaceText = prompt("Text to replace it", "");
	if (!userReplaceText) {
		fl.trace("User canceled command.");
		return;
	}
	
	// set up the regular expression that will
	// replace the specified text (g = globally)
	var searchReg = new RegExp(userFindText, "g");
	var docClassReplaceCount = 0;	// report for document class replacement
	var classReplaceCount = 0;		// report for class replacement
	var baseReplaceCount = 0;		// report for base class replacement
	var item, classText;
	var dom = fl.getDocumentDOM();
	var lib = dom.library;
	
	// Document class
	classText = dom.docClass;
	if (classText){
		dom.docClass = classText.replace(searchReg, userReplaceText);
		
		// if the class text changed, increment report value
		if (classText != dom.docClass){
			docClassReplaceCount++;
		}
	}
	
	// Library items
	var i = lib.items.length;
	while (i--){
		item = lib.items[i];
		
		// class name
		classText = item.linkageClassName;
		if (classText){
			item.linkageClassName = classText.replace(searchReg, userReplaceText);
			
			// if the class text changed, increment report value
			if (classText != item.linkageClassName){
				classReplaceCount++;
			}
		}
		
		// base class
		classText = item.linkageBaseClass;
		if (!classText){
			
			// using default base class check the type to
			// get the implied base class. this is required
			// since the [implied] base class returns "" if
			// not specified by the user
			switch (item.itemType){
				case "button":
					classText = "flash.display.SimpleButton";
					break;
				case "movie clip":
					classText = "flash.display.MovieClip";
					break;
				case "bitmap":
					classText = "flash.display.BitmapData";
					break;
				case "sound":
					classText = "flash.media.Sound";
					break;
				
				// no implied base class - a symbol
				// that cannot have a base class
				default:
					classText = null;
					break;
			}
		}
		
		// check again for class text in case implied
		// text was set. also make sure a class name exists
		// if you're going to change the base otherwise
		// the setting of the base class will fail and the
		// the command will be silently aborted by Flash
		if (classText && item.linkageClassName){
			item.linkageBaseClass = classText.replace(searchReg, userReplaceText);
			
			// if the class text changed, increment report value
			if (classText != item.linkageBaseClass){
				baseReplaceCount++;
			}
		}
	}
	
	// report the results
	alert(docClassReplaceCount +" document classes replaced\n"
		  +classReplaceCount +" library item classes replaced\n"
		  +baseReplaceCount +" library item base classes replaced");
}

// call the method. In case there's
// an error, trace it to the output window
try {
	replaceClassText();
}catch(error){
	fl.trace(error);
}