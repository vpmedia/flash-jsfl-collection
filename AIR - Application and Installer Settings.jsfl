var dom = fl.getDocumentDOM();

if (dom == null)
{
	alert("Failed to get current document.");
}
else
{
	
	var flaFilePath = dom.path;
	var fileName = dom.name;
	if(!flaFilePath || !fileName)
	{
		alert("The Flash AIR file must be saved before opening AIR Application and Installer Settings and before creating the AIR file.");
	}
	else
	{
		
		var folderName = flaFilePath.substring(0, flaFilePath.indexOf(fileName));
	
		if(dom.getPlayerVersion() == 'AdobeAIR1_0')
		{
			FLAir.OpenSettingDialog(flaFilePath);
		}
		else
		{
			//alert("The Publish target is not Adobe AIR 1.0.");
			var gotOK = FLAir.PackageAlert(flaFilePath);
			if (gotOK == 1)
			{
				dom.setPlayerVersion('AdobeAIR1_0');
				dom.save();
				FLAir.OpenSettingDialog(flaFilePath);
			}
		}
	}
}