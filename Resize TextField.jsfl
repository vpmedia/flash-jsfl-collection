function resizeSelectedTextFields(){
	var dom = fl.getDocumentDOM();
	var sel = dom.selection;
	var txt, w, h;
	for (var i=0; i<sel.length; i++){
		txt = sel[i];
		if (txt.__proto__ == Text.prototype){
			w = prompt("TextField Width (pixels):", txt.width);
			h = prompt("TextField Height (pixels):", txt.height);
			if (!isNaN(w) && !isNaN(h)) dom.setTextRectangle({left:0, top:0, right:parseFloat(w)-2, bottom:parseFloat(h)-2});
			else alert("invalid")
			return (0);
		}
	}
}
resizeSelectedTextFields();
