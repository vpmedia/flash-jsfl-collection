/**
 * Recursively exports selected movie clips in the library as swf's.
 */
function MovieClipToSWF()
{
	var docPath=document.path.replace(/\\/g,'/').split('/').slice(0,-1).join('/')+"/";
	var exportPath=docPath='file:///'+docPath;
	var dom=fl.getDocumentDOM();
	var si=dom.library.getSelectedItems();
	var publishProfileSource=docPath+document.name.toString().replace(/\.fla/i,"")+'_publishProfile.xml';
	dom.exportPublishProfile(publishProfileSource);
	var publishProfile=FLfile.read(publishProfileSource);
	var exportval=publishProfile.match(/<flashFileName>(.*)<\/flashFileName>/)[1].replace(/\\/g,"/");
	exportPath=((docPath.indexOf("/")>-1)?docPath+exportval.split("/").slice(0,-1).join("/")+"/":docPath).replace("file:////","");
	while(exportPath.match(/\/$/))exportPath=exportPath.replace(/\/$/,"");
	if(si.length==0)alert('ERROR: No Library items are selected.');
	else for(var i=0;i<si.length;i++)if(si[i].itemType=='movie clip')(si[i].name.indexOf("/")>-1)?si[i].exportSWF("file:///"+exportPath+"/"+(si[i].name.split("/").slice(-1))+".swf"):si[i].exportSWF("file:///"+exportPath+"/"+si[i].name+".swf");
	FLfile.remove(publishProfileSource);
}
MovieClipToSWF();