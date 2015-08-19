/**
 * ImportXMLTemplate.jsfl
 *
 * Uses the functionality of Importer.jsfl to import the contents of a translation XML file into a
 * FLA. This script is designed to be used as a template by an external system. The config values
 * can be dynamically populated before the script is called.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

 // Init

var config =
{
	jobID : "001", // PHP's job ID, use to match log entries to jobs
	logToFile : true, // Whether to log to a file
	logToIDE : true, // Whether to log to the IDE's output panel
	logFilePath : "", // Log file path
	lockFilePath : "", // Lock file path
	flaFilePath : "", // Master FLA file path
	outputFLAFilePath : "", // FLA file path to write
	outputSWFFilePath : "", // SWF file path to write
	xmlFilePath : "", // XML file path to import
	importFormattedText : true,
	libDir : "" // Static JSFL library directory
}

var startTime = new Date();
var scriptPath = fl.scriptURI;
var scriptPathParts = scriptPath.split("/");
var scriptName = scriptPathParts[scriptPathParts.length-1];
var scriptDir = scriptPath.split(scriptName)[0];

// Set defaults if not supplied by PHP:

if ( config.logFilePath == "" ) config.logFilePath = scriptDir+"log";
if ( config.lockFilePath == "" ) config.lockFilePath = scriptDir+"lock";
if ( config.libDir == "" ) config.libDir = scriptDir;
if ( config.flaFilePath == "" ) config.flaFilePath = scriptDir+"../test-files/import-test.fla";
if ( config.xmlFilePath == "" ) config.xmlFilePath = scriptDir+"../test-files/import-test.xml";

// Lock it

FLfile.write(config.lockFilePath,new Date().toString());

// Load modules

fl.runScript(config.libDir+"Utils.jsfl");
fl.runScript(config.libDir+"Logger.jsfl");
fl.runScript(config.libDir+"HTMLParser.jsfl");
fl.runScript(config.libDir+"Importer.jsfl");
fl.runScript(fl.configURI+"JavaScript/ObjectFindAndSelect.jsfl");

// Set more defaults if not supplied by PHP:

var guid = Utils.guid();

if ( config.outputFLAFilePath === "" ) config.outputFLAFilePath = scriptDir+"output/"+guid+".fla";
if ( config.outputSWFFilePath === "" ) config.outputSWFFilePath = scriptDir+"output/"+guid+".swf";

// Start

Utils.initLogger(config,scriptName);

var success = Importer.go(config.flaFilePath,config,true);

if ( success )
{
	Logger.log("Processing completed successfully");
}
else
{
	Logger.log("Errors encountered, operation may have failed",Logger.CRITICAL);
}

// Unlock and exit

Logger.log("Script exiting ("+((new Date().getTime()-startTime.getTime())/1000)+"s)");
FLfile.remove(config.lockFilePath);