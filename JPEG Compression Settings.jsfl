
function init()
{
	fl.outputPanel.clear();
	
	var obj = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/JXL/JPEG Compression/jpegsettings.xml");
	//var obj = fl.getDocumentDOM().xmlPanel("file:///C:/Documents and Settings/Syle/My Documents/_Projects/JPEG Compression Extension/jpegsettings.xml");
	if(obj.dismiss == "cancel")
	{
		return;
	}
	var a = obj.jpegcompression;
	if(a == "")
	{
		alert("JPEG Compression cannot be left blank, use the slider to change the value,\n or type in your desired compression number amount into the text field.");
		return;
	}

	var compressionValue = parseInt(obj.jpegcompression);
	if(isNaN(compressionValue))
	{
		alert("JPEG Compression value has to be a number.  Use the slider instead of typing into the text field.");
		return;
	}
	var doSmoothing = obj.smoothing;
	
	selItems = fl.getDocumentDOM().library.getSelectedItems();
	var i = selItems.length;
	var i2 = selItems.length;
	while(i--)
	{
		selItems[i].useImportedJPEGQuality = false;
		selItems[i].compressionType = "photo";
		selItems[i].quality = parseInt(compressionValue);
		// JXL: Bug... not setting this? At least, the dialogue doesn't show it.
		selItems[i].allowSmoothing = doSmoothing;
	}
}

init();
