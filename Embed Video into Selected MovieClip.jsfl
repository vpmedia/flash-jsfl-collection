var dom = fl.getDocumentDOM();
var theLibrary = dom.library;
var selectedItems = theLibrary.getSelectedItems();

var clip;
var video;

for (var itemIndex = 0; itemIndex < selectedItems.length; itemIndex++)
{
	var theItem = selectedItems[itemIndex];
	switch (theItem.itemType)
	{
		case "movie clip":
			clip = theItem;
			break;
		case "video":
			video = theItem;
			break;
	}
}

theLibrary.editItem(clip.name);
var tl = dom.getTimeline();
tl.currentLayer = 0;
tl.selectAllFrames();
tl.removeFrames();
tl.insertBlankKeyframe(0);

dom.addItem({x:video.width / 2, y:video.height / 2}, video);
var element = dom.selection[0];
element.x = 0;
element.y = 0;
element.name = "video";

dom.currentTimeline = 0;