//=====================================================	
// Instance : setSequenceName1.0
// hisayuki takagi | www.wildcard.jp.org
//=====================================================	
var cur_doc = fl.getDocumentDOM();
var ui = cur_doc.xmlPanel(fl.configURI + "Commands/Instance_setSequenceName.xml");
var sa = new Array();

for(var i1=0; i1<cur_doc.selection.length; i1++){
	if(cur_doc.selection[i1].elementType == "instance"){
		sa.push({obj:cur_doc.selection[i1],pos:cur_doc.selection[i1].top*1000+cur_doc.selection[i1].left});
	}
}
sa.sort(cmp_pos);
function cmp_pos(a, b) {return a.pos - b.pos;}

for(var i1=0; i1<sa.length; i1++){
	var n1 = ui.prefix+ (i1+1);
	sa[i1].obj.name = n1;
}


