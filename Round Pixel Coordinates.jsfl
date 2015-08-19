function init()
{
	fl.outputPanel.clear();
	var timeline = fl.getDocumentDOM().getTimeline();
	var currentLayer = timeline.currentLayer;
	var currentFrame = timeline.currentFrame;
	var elements_array = timeline.layers[currentLayer].frames[currentFrame].elements;
	var i = elements_array.length;
	while(i--)
	{
		var item = elements_array[i];
		if(item.elementType == "shape")
		{
			var theName = "some shape";
		}
		else
		{
			var theName = item.name;
			if(theName == "")
			{
				theName = "some instance";
			}
		}
		var matX = item.matrix;
		var x = matX.tx;
		if(!getIsWholeInt(x))
		{
			fl.trace(theName + "'s x was: " + x);
			matX.tx = round(x);
			item.matrix = matX;
			fl.trace(theName + "'s x now is: " + round(x));
		}
		
		var matY = item.matrix;
		var y = matY.ty;
		if(!getIsWholeInt(y))
		{
			fl.trace(theName + "'s y was: " + y);
			matY.ty = round(y);
			item.matrix = matY;
			fl.trace(theName + "'s y now is: " + item.matrix.ty);
		}
	}
	
}

function getIsWholeInt(n)
{
	var s = String(n);
	if(s.indexOf(".") != -1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function round(n)
{
	var s = String(n);
	var a = s.split(".");
	var num = parseInt(a[0]);
	var dec = parseInt(a[1].substr(0, 1));
	if(dec >= 5)
	{
		num++;
	}
	return num;
}

// start this mug
init();