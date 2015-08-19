//fl.trace("Artemis");
var dom = fl.getDocumentDOM();

if (dom == null)
{
	alert("Failed to get current document.");
}
else
{
	
	var flaFilePath = dom.path;
	//fl.trace(flaFilePath);
	//fl.trace(dom.playerVersion);
	//fl.trace(dom.asVersion);
	//fl.trace(dom.getSWFPathFromProfile());
	
	if(!flaFilePath)
	{
		alert("The Flash AIR file must be saved before opening AIR Application and Installer Settings and before creating the AIR file.");
	}
	else
	{
		if(dom.getPlayerVersion() == 'AdobeAIR1_0')
		{
			FLAir.PackageAIRFile(flaFilePath);
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



