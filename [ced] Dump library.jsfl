function init()
{
	var dom = fl.getDocumentDOM();
	var lib = dom.library;
	var items=lib.items;
	var output = "";
	var folders = new Object();
	var symbols = new Object();
	
	for(var i=0;i<items.length;i++)
	{
		var item=items[i];
		var pathsplit=item.name.split("/");
		if(item.itemType != "folder")
		{
			var mainname=pathsplit[pathsplit.length-1];
			var where = symbols;
			for(var j = 0; j < pathsplit.length - 1; j++)
			{
				if(where[pathsplit[j]] == null)
				{
					where[pathsplit[j]] = new Object();
				}
				where = where[pathsplit[j]];
			}
			where[mainname] = {__specialVal:1,
							   __itemType:item.itemType,
							   __linkageIdentifier:item.linkageIdentifier, 
							   __linkageUrl:item.linkageUrl, 
							   __linkageClassName:item.linkageClassName
							   };
		}
		else
		{
			var pathsplit=item.name.split("/");
			var where = folders;
			for(var j = 0; j < pathsplit.length; j++)
			{
				if(where[pathsplit[j]] == null)
				{
					where[pathsplit[j]] = new Object();
				}
				where = where[pathsplit[j]];
			}
		}
	}
	
	fl.outputPanel.clear();
	
	fl.trace('------------------------------------------------------------------------');
	fl.trace('-----------------------       Library dump      ------------------------');
	fl.trace('------------------------------------------------------------------------');
	traceFolder(folders, symbols, 0);
	fl.trace(folderBuff)
}

function traceFolder(what, symbols, level)
{
	var keys = new Array();
	
	for(var i in what)
	{
		keys.push(i);
	}
	keys.sort();

	for(var i = 0; i < keys.length; i++)
	{
		folderBuff += bn[level] + '+++ ' + keys[i] + "\n";
		traceFolder(what[keys[i]], symbols[keys[i]], level + 1);
	}
	
	var keys = new Array();
	
	for(var i in symbols)
	{
		keys.push(i);
	}
	keys.sort();
	
	for(var j = 0; j < keys.length; j++)
	{
		i = keys[j];
		if(symbols[i].__specialVal == 1)
		{
			folderBuff += bn[level] + '|- ' + i + " (" + symbols[i].__itemType + ")\n";
		}
		
		if(symbols[i].__linkageIdentifier != null)
		{
			folderBuff += bn[level + 1] + " | Linkage identifier: " + symbols[i].__linkageIdentifier + "\n";
		}
		
		if(symbols[i].__linkageClassName != null && symbols[i].__linkageClassName != "")
		{
			folderBuff += bn[level + 1] + " | AS2 class: " + symbols[i].__linkageClassName + "\n";
		}
		
		if(symbols[i].__linkageUrl != null && symbols[i].__linkageUrl != "")
		{
			folderBuff += bn[level + 1] + " | Linkage URL: " + symbols[i].__linkageUrl + "\n";
		}
	}
	return;
}

folderBuff = "";

bn = new Array();
bn[0] = "";
bn[1] = "  ";
bn[2] = "    ";
bn[3] = "      ";
bn[4] = "        ";
bn[5] = "          ";
bn[6] = "            ";
bn[7] = "              ";
bn[8] = "                ";
bn[9] = "                  ";
bn[10] = "                    ";

init();