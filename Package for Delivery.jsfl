var doc = fl.getDocumentDOM();
var lib = doc.library;
var docPath = doc.path;
var rootPath = docPath.substr(0, docPath.lastIndexOf("\\") + 1);
var rootUri = convertFilePathToUri(rootPath);
var deliveryUri = rootUri + "_ForDelivery";
var classPaths = [];
var uriList = [];

//FLfile.createFolder(deliveryUri);
//FLfile.copy(convertFilePathToUri(docPath), deliveryUri + "/" + doc.name);

if (document.docClass.length > 0)
{
	findClassPathsWithin(document.docClass);
	addLibLinkageClasses();
	addClassFilesForDelivery();
}
else
{
	fl.trace("Error: Must contain a Document Class");
}

function addClassFilesForDelivery()
{
	var classCount = classPaths.length;
	for (var classIndex = 0; classIndex < classCount; classIndex++)
	{
		var fileObj = classPaths[classIndex];
		var classPath = fileObj[0];
		var filePath = fileObj[1];
		fl.trace(classPath);
	}
}

function addLibLinkageClasses()
{
	var itemCount = lib.items.length;
	for (var i = 0; i < itemCount; i++)
	{
		var item = lib.items[i];
		var baseClass = item.linkageBaseClass;
		var linkageClass = item.linkageClassName;
		
		if (item.linkageExportForAS == true)
		{
			findClassPathsWithin(baseClass);
			findClassPathsWithin(linkageClass);
		}
	}
}

function findClassPathsWithin(classPath)
{
	var fileObj = getFileForClassPath(classPath);

	if (!arrayContains(uriList, fileObj[1]) && classPath.substr(0, 5) != "flash")
	{
		uriList.push(fileObj[1]);
		classPaths.push(fileObj);
		var importedClasses = getImportedClasses(fileObj[1], fileObj);
		var importCount = importedClasses.length;
		for (var importIndex = 0; importIndex < importCount; importIndex++)
		{
			findClassPathsWithin(importedClasses[importIndex]);
		}
	}
}

function getImportedClasses(classUri, classPathArrayItem)
{
	var code = FLfile.read(classUri);
	var packageName = "";
	var className = classUri.substr(classUri.lastIndexOf("/") + 1).split(".as").join("");
	importedClasses = [];
	lineArray = code.split("\n");
	var lineCount = lineArray.length;

	for (var lineIndex = 0; lineIndex < lineCount; lineIndex++)
	{
		var line = LTrim(lineArray[lineIndex]);
		if (line.substr(0, 7) == "import ")
		{
			line = line.split("import ").join("").split(";")[0];
			importedClasses.push(line);
		}
		if (line.substr(0, 8) == "package ")
		{
			packageName = LTrim(line.split("package ").join(""));
			packageName = packageName.split("{").join("").split(" ").join("").split("\n").join("");
		}
	}
	
	classPathArrayItem[0] = packageName + "." + className;
	return importedClasses;
}

function getFileForClassPath(classPath)
{
	var classPathArrayItem = [];
	classPathArrayItem.push(classPath);
	var newPath = classPath.split(".").join("\\");
	relativeClassPath = rootPath + newPath + ".as";
	relativeClassUri = convertFilePathToUri(relativeClassPath);
	
	if (FLfile.exists(relativeClassUri) == true)
	{
		classPathArrayItem.push(relativeClassUri);
	}
	else
	{
		var absoluteClassUri = "";
		var globalClassPaths = fl.as3PackagePaths.split(";");
		var gcpCount = globalClassPaths.length;
		for (var gcpIndex = 0; gcpIndex < gcpCount; gcpIndex++)
		{
			var path = globalClassPaths[gcpIndex];
			if (path != "." && path.indexOf("$(AppConfig)") == -1)
			{
				var absoluteClassPath = path + "\\" + newPath + ".as";
				var absoluteClassUri = convertFilePathToUri(absoluteClassPath);
				if (FLfile.exists(absoluteClassUri) == true) break;
			}
		}
		
		classPathArrayItem.push(absoluteClassUri);
	}

	return classPathArrayItem;
}

function convertFilePathToUri(filePath)
{
	filePath = filePath.split(":\\").join("|/").split("\\").join("/");
	filePath = "file:///" + filePath;
	
	return filePath;
}

function arrayContains(theArray, arrayItem)
{
	var itemCount = theArray.length;
	for (var i = 0; i < itemCount; i++)
	{
		if (theArray[i] == arrayItem) return true;
	}
	return false;
}

function LTrim(theString)
{
	theString = theString.split("\t").join("").split("\n").join("");
	stringLength = theString.length;
	for (var j = 0; j < stringLength; j++)
	{
		if (theString.substr(j, 1) != " ")
		{
			theString = theString.substr(j);
			break;
		}
	}
	return theString;
}