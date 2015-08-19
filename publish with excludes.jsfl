/**
 * Publish the current document. Excluding any classes 
 * found in a {fla_name}_exclude.xml file.
 */
function publishWithExcludes(traces,throwOnFail)
{
	var docName = document.name.toString().replace(/\.fla/i,"");
	var dom = fl.getDocumentDOM();
	var modifiedLibraryItems=[];
	var renamedClasses=[];
	var tmp,tmp2,i,j,res,os,items,item,publish;
	var as3PackagePaths,publishProfileSource,libPublishProfileSource;
	var failErrorMessage,traceMessage;
	var docPath=getDocumentPath();
	var isSaved=(document.path)?true:false;
	var cu=unescape(fl.configURI).toLowerCase();
	if(cu.indexOf("macintosh hd")>-1)os="mac";
	else if(cu.indexOf("c|")>-1)os="win";
	items = dom.library.items;
	publish = true;//publish flag,set to false to debug (runs the script without any publishing).
	if(!publish) fl.trace("OS: "+os);
	
	//get document path, for win/mac
	function getDocumentPath()
	{
		var path = document.path.replace(/\\/g, '/').split('/').slice(0,-1).join('/');
		path = path.replace(/\\/g, '/');
		if((path.indexOf(':/') != -1) || (path.charAt(0) == '/')) while(path.charAt(0) == '/') path = path.substr(1);
		if(path.indexOf('file:///') != 0) path = 'file:///' + path;
		path += '/';
		return path;
	}

	//cleans up all the temp files
	function cleanup()
	{
		if(publishProfileSource) dom.importPublishProfile(publishProfileSource);
		FLfile.remove(libPublishProfileSource);
		FLfile.remove(publishProfileSource);
		FLfile.remove(docPath + docName + '_lib____.swf');
		FLfile.remove(docPath + docName + '_lib____.swc');
		for(i=0;i<renamedClasses.length;i++) //un-rename renamed classes.
		{
			if(FLfile.copy(renamedClasses[i]+'.bkup',renamedClasses[i]))
			{
				if(!FLfile.remove(renamedClasses[i]+'.bkup')) fl.trace('Warning: unable to delete temporary file ' + renamedClasses[i] + '.bkup');
			}
			else fl.trace('Warning: unable to restore file ' + renamedClasses[i]);
		}
		for(i=0;i<modifiedLibraryItems.length;i++) modifiedLibraryItems[i].linkageExportInFirstFrame=true; //un-modify modified library items.
	}
	
	if(isSaved) //must be saved.
	{
		var xcontents,xfile,filepath;
		var contents = FLfile.read(getDocumentPath() + docName + '_exclude.xml'); //reads exclude xml
		var xpattern = /name="([^"]+)"/g;
		if(contents)
		{
			contents = contents.replace(/\n/g, ' ').replace(/<!--.*?-->/g, ''); //comments
			var pattern = /name="([^"]+)"/g;
			var excludedClasses = [];
			while(tmp = pattern.exec(contents)) excludedClasses.push(tmp[1]);
			pattern = /file="([^"]+)"/g;
			while(tmp=pattern.exec(contents))
			{
				xfile = tmp[1];
				if(os=="mac")
				{
					if(xfile.substr(0,1)=="/") filepath = "Macintosh HD/"+xfile.substr(1,xfile.length); //file="/Users/aaronsmith"
					else if(xfile.toLowerCase().indexOf("macintosh hd")>-1) filepath = xfile; // file="Macintosh HD/xxxx"
					else filepath = getDocumentPath() + xfile; //file="./xxx" ||  file="../../xxx" || file="someexcludes.xml"
				}
				else if(os=="win")
				{
					xfile = xfile.replace(/\//,"/");
					if(xfile.substr(0,2).match(/^[a-z]\:/i)) filepath = xfile;//file="c:/xxx"
					else filepath = getDocumentPath() + xfile;
				}
				filepath = filepath.replace(/file\:\/\/\//,"");
				filepath = filepath.replace(/\/{2,}/g,"/");
				filepath = "file:///"+filepath;
				xcontents = FLfile.read(filepath);
				xcontents = xcontents.replace(/\n/g, ' ').replace(/<!--.*?-->/g, ''); //comments
				while(xtmp=xpattern.exec(xcontents)) excludedClasses.push(xtmp[1]);
			}
			if(excludedClasses.length)
			{
				publishProfileSource = getDocumentPath() + docName + '_publishProfile.xml'; //the file name to write the current publish profile to.
				dom.exportPublishProfile(publishProfileSource);
				var publishProfile = FLfile.read(publishProfileSource);
				as3PackagePaths = (/<AS3PackagePaths>(.*?)<\/AS3PackagePaths>/.exec(publishProfile)[1] + ';' + fl.as3PackagePaths).replace(/\$\(AppConfig\)/g, fl.configURI).split(';');
				//create a new publish profile for creating the library swc.
				var libPublishFormatProperties='<PublishFormatProperties enabled="true">\n<defaultNames>0</defaultNames>\n<flash>1</flash>\n<generator>0</generator>\n<projectorWin>0</projectorWin>\n<projectorMac>0</projectorMac>\n<html>0</html>\n<gif>0</gif>\n<jpeg>0</jpeg>\n<png>0</png>\n<qt>0</qt>\n<rnwk>0</rnwk>\n<flashDefaultName>0</flashDefaultName>\n<generatorDefaultName>0</generatorDefaultName>\n<projectorWinDefaultName>0</projectorWinDefaultName>\n<projectorMacDefaultName>0</projectorMacDefaultName>\n<htmlDefaultName>0</htmlDefaultName>\n<gifDefaultName>0</gifDefaultName>\n<jpegDefaultName>0</jpegDefaultName>\n<pngDefaultName>0</pngDefaultName>\n<qtDefaultName>0</qtDefaultName>\n<rnwkDefaultName>0</rnwkDefaultName>\n<flashFileName>%FILE_NAME%.swf</flashFileName>\n<generatorFileName>%FILE_NAME%.swt</generatorFileName>\n<projectorWinFileName>%FILE_NAME%.exe</projectorWinFileName>\n<projectorMacFileName>%FILE_NAME%.app</projectorMacFileName>\n<htmlFileName>%FILE_NAME%.html</htmlFileName>\n<gifFileName>%FILE_NAME%.gif</gifFileName>\n<jpegFileName>%FILE_NAME%.jpg</jpegFileName>\n <pngFileName>%FILE_NAME%.png</pngFileName>\n<qtFileName>%FILE_NAME%.mov</qtFileName>\n<rnwkFileName>%FILE_NAME%.smil</rnwkFileName>\n</PublishFormatProperties>';
				libPublishFormatProperties = libPublishFormatProperties.replace(/%FILE_NAME%/g, docName + '_lib____');
				var libPublishProfile = publishProfile.replace(/\n/g, '%NEWLINE%').replace(/<PublishFormatProperties.*?\/PublishFormatProperties>/, libPublishFormatProperties).replace(/%NEWLINE%/g, '\n').replace(/<ExportSwc.*?\/ExportSwc>/, '<ExportSwc>1</ExportSwc>');
				libPublishProfileSource = getDocumentPath() + docName + '_lib____' + '_publishProfile.xml';
				if(!FLfile.write(libPublishProfileSource,libPublishProfile))
			  {
					cleanup();
					failErrorMessage = "The library publish profile could not be saved";
					if(throwOnFail) throw failErrorMessage;
					res = false;
			  }
				for(i=excludedClasses.length-1;i>0;i--) if(excludedClasses.indexOf(excludedClasses[i])!=i) excludedClasses.splice(i,1); //eliminate redundancies in excludes.
		    dom.importPublishProfile(libPublishProfileSource); //set the new library publish profile
				if(publish) dom.publish(); //publish the library fla to produce the swc file
				for(i=0;i<excludedClasses.length;i++) //rename/move excluded classes so that they aren't compiled into the swf
				{
					var classSource;
					var searchDir;
					var className = excludedClasses[i].replace(/\./g,"/") + ".as";
					for(var j=0;j<as3PackagePaths.length;j++) //find the location(s) of the class.
					{
						if(!as3PackagePaths[j]) continue;
						searchDir = as3PackagePaths[j];
						searchDir = unescape(searchDir.replace(/file\:\/\/\//,""));
						searchDir = searchDir.replace(/c|/i,"");
						searchDir = searchDir.replace(/\/\|\//,"/");
						searchDir = searchDir.replace(/\\/g, '/');
						searchDir = searchDir.replace(/\:/g,"/");
						searchDir = searchDir.replace(/\/{2,}/g,"/");
						if(searchDir.substr(0,1)==".")searchDir=getDocumentPath()+searchDir;
						searchDir = searchDir.replace(/file\:\/\/\//,"");
						if(os == "mac")
						{
							if(!publish) fl.trace("IN MAC");
							if(searchDir.toLowerCase().indexOf("macintosh hd")<0)searchDir="Macintosh HD/"+searchDir;
						}
						else if(os == "win")
						{
							if(!publish) fl.trace("IN WIN");
							if(searchDir.toLowerCase().indexOf("c:")<0)searchDir="C:/"+searchDir;
						}
						if(searchDir.lastIndexOf("/")<searchDir.length-1) searchDir += "/";
						searchDir = searchDir.replace(/\/{2,}/g,"/");
						classSource = "file:///"+searchDir+className;
						if(!publish) fl.trace("CLASS SOURCE");
						if(!publish) fl.trace(classSource);
						if(FLfile.exists(classSource))
						{
							if(!publish) fl.trace("FOUND FILE " + classSource);
							renamedClasses.push(classSource);
							if(!FLfile.copy(classSource,classSource+'.bkup')||!FLfile.remove(classSource)) //tmp rename class
							{
								cleanup();
								res = false;
								failErrorMessage = "Unable to rename file "+classSource;
								if(throwOnFail) throw failErrorMessage;
							}
							break;
						}
					}
				}
				for(i=0;i<items.length;i++) //alter library items that have exclude classes in first frame
				{
					item = items[i];
					if((excludedClasses.indexOf(item.linkageClassName)!=-1)||(excludedClasses.indexOf(item.linkageBaseClass)!=-1))
					{
						if(item.linkageExportInFirstFrame)
						{
								modifiedLibraryItems.push(item);
								item.linkageExportInFirstFrame = false;
						}
					}
				}
				res = true;
				dom.importPublishProfile(publishProfileSource);
				if(publish) dom.testMovie();
				cleanup();
			}
			else
			{
				res = true;
				traceMessage = "Nothing was excluded.";
				if(publish) dom.testMovie(); //no excludes
			}
		}
		else
		{
			res = true;
			traceMessage = "Exclude classes must be declared in " + docName + "_exclude.xml";
			if(publish) dom.testMovie(); //no _exclude.xml file
		}
	}
	else fl.alert("In order to publish with excludes, the fla must be saved.");
	if(traces && traceMessage) fl.trace(traceMessage);
	return res;
}
//a result of true means ok
//a result of false means errors.
result = publishWithExcludes(true,true);