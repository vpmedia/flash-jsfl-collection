//=====================================================	
// Instance : setMcName1.0
// hisayuki takagi | www.wildcard.jp.org
//=====================================================	
var cur_doc = fl.getDocumentDOM();
for(var i1=0; i1<cur_doc.selection.length; i1++){
	if(cur_doc.selection[i1].elementType == "instance"){
		cur_doc.selection[i1].name = cur_doc.selection[i1].libraryItem.name
	}
}


