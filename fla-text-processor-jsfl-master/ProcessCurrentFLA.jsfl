/**
 * ProcessCurrentFLA.jsfl
 *
 * Uses the functionality of Processor.jsfl to prepare the currently open FLA for translation and
 * generate the translation XML.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

var config =
{
	lang : "en_GB", // Language code to add to XML file
	jobID : "000", // PHP's job ID, use to match log entries to jobs
	logToFile : false, // Whether to log to a file
	logToIDE : true, // Whether to log to the IDE's output panel
	outputXMLFilePath : "", // XML file path to write
	outputFLAFilePath : "", // FLA file path to write
	outputSWFFilePath : "", // SWF file path to write
	outputFormattedText : true, // Output the text in the XML with formatting or else raw strings.
	libDir : "", // Static JSFL library directory
	outputFolder : ""
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
fl.runScript(config.libDir+"Processor.jsfl");
fl.runScript(fl.configURI+"JavaScript/ObjectFindAndSelect.jsfl");

// Get user input for language code and output folder etc.:

config.outputFormattedText = confirm("Generate XML with text formatting data?");
config.lang = prompt("Enter the language code",config.lang);
config.outputFolder = fl.browseForFolderURL("Select the output folder");

var outputFileName = fl.getDocumentDOM().name+"_"+config.lang;
outputFileName = outputFileName.replace(/\.fla/ig,"")
var outputFilePath = config.outputFolder+"/"+outputFileName;

config.outputXMLFilePath = outputFilePath+".xml";
config.outputFLAFilePath = outputFilePath+".fla";
config.outputSWFFilePath = outputFilePath+".swf";

// Start

Utils.initLogger(config,scriptName);

var success = Processor.go(fl.getDocumentDOM(),config,false);

if ( success )
{
	Logger.log("Processing completed successfully");
}
else
{
	Logger.log("Errors encountered, operation failed",Logger.WARNING);
}

Logger.log("Script exiting ("+((new Date().getTime()-startTime.getTime())/1000)+"s)");