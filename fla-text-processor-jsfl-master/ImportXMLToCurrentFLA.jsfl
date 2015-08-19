/**
 * ImportXMLToCurrentFLA.jsfl
 *
 * Uses the functionality of Importer.jsfl to import translation XML into the currently open FLA.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

 // Init

var config =
{
	jobID : "000", // PHP's job ID, use to match log entries to jobs
	logToFile : false, // Whether to log to a file
	logToIDE : true, // Whether to log to the IDE's output panel
	outputFLAFilePath : "", // FLA file path to write
	outputSWFFilePath : "", // SWF file path to write
	xmlFilePath : "", // XML file path to import
	importFormattedText : true,
	outputFolder : "",
	libDir : "", // Static JSFL library directory
	outputFileName : ""
}

var startTime = new Date();
var scriptPath = fl.scriptURI;
var scriptPathParts = scriptPath.split("/");
var scriptName = scriptPathParts[scriptPathParts.length-1];
var scriptDir = scriptPath.split(scriptName)[0];

config.libDir = scriptDir+"lib/";

// Load modules

fl.runScript(config.libDir+"Utils.jsfl");
fl.runScript(config.libDir+"Logger.jsfl");
fl.runScript(config.libDir+"HTMLParser.jsfl");
fl.runScript(config.libDir+"Importer.jsfl");
fl.runScript(fl.configURI+"JavaScript/ObjectFindAndSelect.jsfl");

// Get user input:

config.importFormattedText = confirm("Parse XML for text formatting information?");
config.xmlFilePath = fl.browseForFileURL("select","Select the XML file");
config.outputFolder = fl.browseForFolderURL("Select the output folder");
config.outputFileName = prompt("Select output filename",fl.getDocumentDOM().name.replace(/\.fla/ig,""));

var outputFilePath = config.outputFolder+"/"+config.outputFileName;

config.outputFLAFilePath = outputFilePath+".fla";
config.outputSWFFilePath = outputFilePath+".swf";

// Start

Utils.initLogger(config,scriptName);

var success = Importer.go(fl.getDocumentDOM(),config,false);

if ( success )
{
	Logger.log("Processing completed successfully");
}
else
{
	Logger.log("Errors encountered, operation may have failed",Logger.CRITICAL);
}

Logger.log("Script exiting ("+((new Date().getTime()-startTime.getTime())/1000)+"s)");