
//layer delete function////////////

function deleteTekLayers(){
	doc=fl.getDocumentDOM();
	tl=doc.getTimeline();
	var slayers=tl.findLayerIndex("[tek]-removeLayer");
	
	for(var i=0;i<slayers.length;i++){
		tl.deleteLayer(slayers[i]);
	}
}
//////////////////////////////////



doc=fl.getDocumentDOM();
tl=doc.getTimeline();


//distribute selection
tl.setLayerProperty("name","[tek]-removeLayer","selected");
doc.distributeToLayers();

if(doc.selection.length>0){	
	//get layer info and lock all layers
	var selectedLayer=tl.getSelectedLayers();
	layers=tl.layers;
	tl.setLayerProperty("locked",true,"all");
	
	// isolate and convert each object
	for(var i=0;i<layers.length;i++){
		doc.selectNone();
		tl.setSelectedLayers(i,i);
		tl.setLayerProperty("locked",false,"selected");
		doc.selectAll();
		if(doc.selection.length>0){
			//convert only if not symbol
			var seltype=doc.selection[0].instanceType;
			if(seltype!="symbol"){
				var iitem=doc.selection[0].libraryItem;
				if(iitem==null){
					var iname=doc.selection[0].elementType+"_"+i;
				}else{
					var iname=iitem.name;
				}
				var isplit=iname.split(".");
				var uname=isplit[0];
				tl.setLayerProperty("name",uname,"selected");
				doc.convertToSymbol("movie clip",uname,"top left");
				doc.setElementProperty("name",uname+"_mc");
			}
		}
		tl.setLayerProperty("locked",true,"selected");
	}
	
	
	
	tl.setLayerProperty("locked",false,"all");
	deleteTekLayers();
}
