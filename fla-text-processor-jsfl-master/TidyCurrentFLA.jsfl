/**
 * TidyCurrentFLA.jsfl
 *
 * Tidies the library of the currently open FLA with the Utils.tidyLibrary method.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

var config =
{
	jobID : "000", // PHP's job ID, use to match log entries to jobs
	logToFile : false, // Whether to log to a file
	logToIDE : true, // Whether to log to the IDE's output panel
	libDir : "" // Static JSFL library directory
}

var startTime = new Date();
var scriptPath = fl.scriptURI;
var scriptPathParts = scriptPath.split("/");
var scriptName = scriptPathParts[scriptPathParts.length-1];
var scriptDir = scriptPath.split(scriptName)[0];

config.libDir = scriptDir+"lib/";

fl.runScript(config.libDir+"Utils.jsfl");
fl.runScript(config.libDir+"Logger.jsfl");

Utils.initLogger(config,scriptName);

try
{
	Utils.tidyLibrary(fl.getDocumentDOM());
	Utils.tidyLibrary(fl.getDocumentDOM());
}
catch (p_error)
{
	Logger.log("Error tidying library. "+p_error,Logger.CRITICAL);
}

Logger.log("Script exiting ("+((new Date().getTime()-startTime.getTime())/1000)+"s)");