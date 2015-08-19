fl.outputPanel.clear();
var doc = fl.getDocumentDOM();

var lib = doc.library;
var currFrameRate = doc.frameRate;
var newFrameRate = prompt("Enter new desired frame rate:", currFrameRate.toString());
var adjustMode = prompt("Adjust all movieclip timelines? (0=no, 1=yes)", 1);

if (newFrameRate != null && adjustMode != null)
{
	if (adjustMode == 1) selectMainTimeline();
	adjustTimeline();
	if (adjustMode == 1)
	{
		var libItemCount = lib.items.length;
		for (var libItemIndex = 0; libItemIndex < libItemCount; libItemIndex++)
		{
			var libItem = lib.items[libItemIndex];
			if (libItem.itemType == "movie clip")
			{
				lib.editItem(libItem.name);
				adjustTimeline();
			}
		}
	}

	if (adjustMode == 1) doc.frameRate = parseFloat(newFrameRate);
	selectMainTimeline();
	fl.trace("Timeline adjustment complete");
}
else
{
	fl.trace("Action cancelled");
}

function selectMainTimeline()
{
	doc.editScene(0);
}

function adjustTimeline()
{
	var tl = doc.getTimeline();
	fl.getDocumentDOM().getTimeline().expandFolder(true, true, -1);
	var layerArray = tl.layers;
	var layerCount = layerArray.length;
	
	for (var layerIndex = 0; layerIndex < layerCount; layerIndex++)
	{
		tl.currentLayer = layerIndex;
		var currLayer = layerArray[layerIndex];
		var frameArray = currLayer.frames;
		var frameCount = frameArray.length;
		var keyFrameArray = new Array();
		var currStartFrame = 0;
		keyFrameArray.push(currStartFrame);

		for (var frameIndex = 0; frameIndex < frameCount; frameIndex++)
		{
			var currFrame = frameArray[frameIndex];
			
			if (currFrame.startFrame != currStartFrame)
			{
				keyFrameArray.push(currFrame.startFrame);
				currStartFrame = currFrame.startFrame;
			}
		}

		var keyFrameCount = keyFrameArray.length;
		var endFrame = currLayer.frameCount - 1;
		var frameChange = 0;

		for (var keyFrameIndex = 0; keyFrameIndex < keyFrameCount; keyFrameIndex++)
		{
			var frameStart = keyFrameArray[keyFrameIndex];
			
			if (keyFrameIndex == (keyFrameCount - 1))
			{
				var frameEnd = endFrame;
			}
			else
			{
				var frameEnd = keyFrameArray[keyFrameIndex + 1];
			}

			var duration = frameEnd - frameStart;
			var seconds = duration / currFrameRate;
			var destFrameDur = seconds * newFrameRate;
			frameChange = Math.round(duration - destFrameDur);

			if (frameChange > 0)
			{
				if (frameChange > 0) tl.removeFrames(frameStart, (frameStart + frameChange));
				endFrame -= frameChange;

				for (var i = 0; i < keyFrameCount; i++)
				{
					if (i > keyFrameIndex)
					{
						keyFrameArray[i] -= frameChange;
					}
				}
			}
			else
			{
				frameChange = Math.abs(frameChange);

				if (frameChange > 0) tl.insertFrames(frameChange, false, frameStart);

				endFrame += frameChange;

				for (var i = 0; i < keyFrameCount; i++)
				{
					if (i > keyFrameIndex)
					{
						keyFrameArray[i] += frameChange;
					}
				}
			}
		}
	}
}


