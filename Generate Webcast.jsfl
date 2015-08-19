//var _timestamps = "00:00:00.00\n00:00:06.50\n00:00:33.50\n00:00:37.50\n00:01:25.00\n00:01:46.50\n00:02:06.00\n00:02:30.00\n00:02:46.00\n00:02:52.00\n00:03:09.00\n00:03:30.00\n00:03:46.00\n00:03:50.00\n00:04:08.00\n00:04:22.50\n00:04:42.00\n00:04:56.50\n00:05:08.00\n00:05:14.00\n00:05:43.00\n00:06:14.50\n00:06:40.50\n00:06:53.50\n00:07:15.00\n00:07:34.50\n00:07:47.00\n00:08:08.00\n00:08:30.00";
//buildWebcast("Slide#.jpg", "frozen_foods.mp3", "9", "13", _timestamps);

function buildWebcast(slideNamePattern, soundItemName, mins, seconds, timestamps)
{
	var times = [];
	var doc = fl.getDocumentDOM();
	var timeline = doc.getTimeline();
	
	// Get timestamps
	var lines = timestamps.split("|");
	var lineCount = lines.length;
	for (var lineIndex = 0; lineIndex < lineCount; lineIndex++)
	{
		var line = lines[lineIndex];
		var timeSplit = line.split(":");
		var timeSec = parseInt(timeSplit[0] * 60 * 60) + parseInt(timeSplit[1] * 60) + Math.round(parseFloat(timeSplit[2]));
		times.push(timeSec);
	}
	
	var totalTimeDuration = times[times.length - 1];
	var totalFrameDuration = totalTimeDuration * doc.frameRate;
	
	// Create new slides layer
	timeline.addNewLayer("Slide_Images", "normal", true);
	var currFrame = 0;
	var itemCount = times.length;
	for (var itemIndex = 0; itemIndex < itemCount; itemIndex++)
	{
		var libName = slideNamePattern.split("#").join((itemIndex + 1).toString());
		var selItem = doc.library.items[doc.library.findItemIndex(libName)];
		var frameLength = (itemIndex < times.length - 1) ? ((times[itemIndex + 1] - times[itemIndex]) * doc.frameRate) : (1);

		if (itemIndex > 0) timeline.insertBlankKeyframe(currFrame);
		doc.addItem({x:doc.width / 2, y:doc.height / 2}, selItem);
		timeline.insertFrames(frameLength);
		currFrame += frameLength;
	}
	
	// Create new audio layer
	timeline.addNewLayer("Slide_Audio", "normal", true);
	
	// Find MP3 library object and put it on Audio layer
	var audioItem = doc.library.items[doc.library.findItemIndex(soundItemName)];
	var soundFrames = doc.frameRate * Math.round(parseInt(mins * 60) + parseFloat(seconds));
	
	timeline.layers[timeline.currentLayer].frames[0].soundLibraryItem = audioItem;
	timeline.insertFrames(soundFrames);
}