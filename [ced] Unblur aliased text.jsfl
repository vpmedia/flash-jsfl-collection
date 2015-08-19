function doCommand()
{
	var tf = fl.getDocumentDOM().selection[0];
	var document = fl.getDocumentDOM();
	if(tf == null || tf.elementType != "text")
	{
		return;
	}
	var w = Math.round(tf.width - 2);
	var h = Math.round(tf.height - 2);
	var l = Math.round(tf.left);
	var t = Math.round(tf.top);
	
	document.setTextRectangle({top:t, left:l, right:l+w, bottom:t+h});
	document.moveSelectionBy({x:l - tf.left, y:t - tf.top});
	
	//Now move out of the movieclip until we are at the root
	var sel;
	var newSel;
	while(true)
	{
		sel = fl.getDocumentDOM().selection[0];
		document.exitEditMode();
		newSel = fl.getDocumentDOM().selection[0];
		if(newSel == sel)
		{
			break;
		}
		else
		{
			var mat = newSel.matrix;
			mat.tx = Math.round(mat.tx);
			mat.ty = Math.round(mat.ty);
			newSel.matrix = mat;
			document.setTransformationPoint({x:0, y:0});
		}
	}
}

doCommand();