/**

	Disable Excludes JSFL
	Martijn de Visser
	http://www.martijndevisser.com/

	This script disables all *_exclude.xml files in the same directory as the current open .fla document by
	moving them to /excludes/ subdirectory. This directory will be created if not present.
*/

// get current path
var path = fl.getDocumentDOM().path;

if (path != undefined) {

	fl.outputPanel.clear();

	// cleanup path
	path = path.substr(0, path.lastIndexOf("\\") + 1);
	path = path.replace(/\\/g, "/");
	path = "file:///" + path;

	// we need a bit of a workaround here, as JSFL appears
	// not to list files correctly when using wildcards (at least under Win2k)..
	// FLfile.listFolder(path + "_exclude.xml", "files"); should
	// be sufficient, but files with multiple '_' in them will
	// then be ignored.
	var source = FLfile.listFolder(path + "*.xml", "files");
	var files = new Array();
	for (var i=0; i<source.length; ++i) {

		if (source[i].indexOf("_exclude.xml")) {

			files[files.length] = source[i];
		}
	}

	fl.trace("Disable Excludes\nMoving '*_exclude.xml' to './excludes/' ...");

	// is target directory present?
	if (!FLfile.exists(path + "excludes/")) {
		fl.trace("folder ./excludes/ not present, creating...");
		FLfile.createFolder(path + "excludes/");
	}

	// move files
	var count = 0;
	for (var i=0; i<files.length; ++i) {

		var name = files[i];
		var source = path + name
		var target = path + "excludes/" + name

		if (FLfile.copy(source, target)) {

			FLfile.remove(source);
			fl.trace(" - " + name);
			count++;
		}
	}

	fl.trace(count + " files moved.");

} else {

	alert("Disable Excludes JSFL:\n\nSave file before applying this command.");
}