function bitmap_quality(doc){ 
	
	var path=getFolderURI(doc.path);
	var tempFile=path.substr(0,path.lastIndexOf('/'))+'/temp.swf';
	
	var library=fl.getDocumentDOM().library;
	var items=library.items;
	var items_length=items.length;
	for( var h = 0; h < items_length; h++){
		var item=items[h];
		var item_name=item.name.substr(item.name.lastIndexOf('/')+1);		
		if(item.itemType=='bitmap'){
			if(!item.useImportedJPEGQuality){
				
				item.compressionType='lossless';
				doc.exportSWF(tempFile,true);
				var lossless_size=FLfile.getSize(tempFile);
				
				item.compressionType='photo';
				item.quality=100;
				doc.exportSWF(tempFile,true);
				var photo_size=FLfile.getSize(tempFile);
				
				var advantage=lossless_size-photo_size;
				
				if(advantage<500){
					item.compressionType='lossless';
				}else{
					item.compressionType='photo';
					item.quality=90;
				}
				
				fl.trace(item_name+' compression decided to be '+item.compressionType);
				FLfile.remove(tempFile);
				
			}
		}
	}
}

function kbytes(bytes) {
	return (Math.round((bytes/1024)*10)/10)+' kb';
}

function getFolderURI(folderURI) {
	folderURI = replaceStr(folderURI, '\\', '/');
	folderURI = replaceStr(folderURI, ' ', '%20');
	folderURI = replaceStr(folderURI, ':', '|');
	folderURI = 'file:///'+folderURI;
	return folderURI;
}

function replaceStr(origStr, searchStr, replaceStr) {
	var tempStr = '';
	var startIndex = 0;
	if (searchStr == '') {
		return origStr;
	}
	if (origStr.indexOf(searchStr) != -1) {
		while ((searchIndex=origStr.indexOf(searchStr, startIndex)) != -1) {
			tempStr += origStr.substring(startIndex, searchIndex);
			tempStr += replaceStr;
			startIndex = searchIndex+searchStr.length;
		}
		return tempStr+origStr.substring(startIndex);
	} else {
		return origStr;
	}
}

bitmap_quality(fl.getDocumentDOM());