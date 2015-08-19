/*

Change all textfields with "Anti-alias for animation" back to "Use device fonts".

Features:

- Searches within all scenes, and all their contents
- Searches within all library items, to find clips not used in a scene
- Searches within all groups (Flash CS4 only)
- Only changes "Anti-alias for animation" textfields
- Preserves textfields with Custom or "Anti-alias for readability"

*/

fl.showIdleMessage(false);

fl.outputPanel.clear();//clear output panel
fl.trace("\n****************************************\n");

var seenMCs = {};

var date = new Date();
var ms1 = date.getTime();
var tfnum = 0;
var tfmod = 0;

//currently focussed document
var d = fl.getDocumentDOM();


//Iterate through all scenes
var mtl = d.timelines;

for (var snum = 0, slen = mtl.length; snum<slen; snum++){
	d.currentTimeline = snum; // Set active timeline(scene)
	
	var tln = mtl[snum];	
	var objs = go(null, null, tln);
}	


//Iterate through all items in library
var arr = d.library.items;
var alen = arr.length;
for(n = 0; n < alen; n++){
	
	var ar = arr[n];
	if(ar.itemType !== "folder"){

		var tl = ar.timeline;
		var objs = go(ar ,ar, tl);
	}
}

date = new Date();
var ms2 = date.getTime();

fl.trace("\nSCRIPT TIME: "+ ((ms2-ms1)/1000) + " sec.");
fl.trace("MODIFIED "+tfmod+" of "+tfnum+" TEXTFIELDS");
fl.trace("\n****************************************");



function go(pmc, mc, tl, lvl){

	// dont go thru same thing twice
	if(pmc != null){
		if (seenMCs[pmc.name]==1){
			d.library.editItem(pmc.name);
			return;
		}else{
			seenMCs[pmc.name]=1;// done
		}
	}
	
	// go in
	if(mc != null){
		d.library.editItem(mc.name);
	}
	
	if (tl==null){	return; }
	
	if(!lvl){ lvl = "  "; }
	
	// layers
	for(var t=0,tlen = tl.layers.length; t<tlen; t++){
	
		// go through all the frames
		for(var f=0,lfrm = tl.layers[t].frameCount; f<lfrm; f++){

			var el = tl.layers[t].frames[f].elements;
			goFrame(mc, el, lvl+"    ", tl.name);
		}
	}
	
	// go out
	if(pmc != null){
		d.library.editItem(pmc.name);
	}
}

function goFrame(mc, obj, lvl, tln){
	if(tln==null){tln = "?";}

	if (obj==null){	return; }
	
	for (var o=0, oblen=obj.length; o<oblen; o++){
		
		var ob = obj[o];
		var ot = obj[o].elementType; //element type
								 
		if(ot == "instance"){
			
			var oi = ob.libraryItem.symbolType //SymbolItem Type: "movie clip"  "button"  and "graphic"
			
			if(oi == "movie clip"){
				go(mc, ob, ob.libraryItem.timeline, lvl+"    ")
				
				
			}else if(oi == "button"){		
				go(mc, ob, ob.libraryItem.timeline, lvl+"    ")				
				
			}else if(oi == "graphic"){
				go(mc, ob, ob.libraryItem.timeline, lvl+"    ")
			}
			
		}else if(ot == "shape" || ot == "shapeObj"){//for Group objects
			
			if(ob.isGroup){
				goFrame(mc, ob.members, lvl+"    ");// find objs in group
			}
		}else if(ot == "text"){//text
			
			tfnum++; //Total textfields
			var tft = ob.textType != "static"?ob.name:"Static";
			
			if(ob.fontRenderingMode == "standard"){
				fl.trace(tln+"\t - MODIFIED "+tft+"\t - "+fntRenderType(ob.fontRenderingMode)+" - SET TO - Device Fonts");
				ob.fontRenderingMode = "device";
				tfmod++; //Modified textfields
			}
		}
	}	
}

function fntRenderType(rdrMode){
	
	switch(rdrMode){
		
		case "device":		return "Device Fonts";
		case "bitmap":		return "Bitmap Fonts";
		case "standard":	return "Anti-Alias for Animation";
		case "advanced":	return "Anti-Alias for Readability";
		case "customThicknessSharpness":	return "Custom Anti-Alias";

	}
}

