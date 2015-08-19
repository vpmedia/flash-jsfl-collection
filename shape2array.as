// draw the new extracted image
function drawArray (_arr:Array) {
	// trace ("drawArray ");
	var _shape:Shape = new Shape();
	_shape.graphics.lineStyle (1, 0x333333, 1);
	_shape.graphics.beginFill (0xcccccc);
	_shape.graphics.moveTo (_arr[0][0], _arr[0][1]); // starting point
	for (var i=1; i<=_arr.length; i+=3) {
		_shape.graphics.curveTo (_arr[i][0], _arr[i][1] , _arr[i+1][0], _arr[i+1][1]);
		// _shape.graphics.lineTo (_arr[i+1][0], _arr[i+1][1]);
	}
	_shape.graphics.endFill ();
	this.drawContainer_mc.addChild (_shape);
}

// jumpstart everything
function init (){
	for (var j=0; j<shapeArrayz.length; j++) {
		// trace(shapeArrayz[j])
		drawArray (shapeArrayz[j]);
	}
}
init ();
