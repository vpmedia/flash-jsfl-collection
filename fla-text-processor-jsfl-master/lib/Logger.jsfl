/**
 * Logger
 *
 * Logs debug information to a log file and/or the Flash IDE's output panel.
 *
 * @author JedR, Seisaku Ltd <jed@seisaku.co.uk>
 */

var Logger =
{
	SYSTEM : "[SYST]",
	WARNING : "[WARN]",
	CRITICAL : "[CRIT]",
	
	logToFile : true,
	logToIDE : true,
	logFilePath : "",
	jobID : "",
	scriptName : "",

	/**
	 * Logger needs to be initialised before use.
	 *
	 * @param p_logToFile Boolean value, whether to log ouput to a file.
	 * @param p_logToIDE Boolean valuem whether to log outout to the IDE.
	 * @param p_logFilePath Full file path to the desired log file location.
	 * @param p_jobID A reference number to the current job ID, supplied to the main script by PHP.
	 * @param p_scriptName The filename of the currently running script.
	 *
	 * @return Void.
	 */
	init : function(p_logToFile,p_logToIDE,p_logFilePath,p_jobID,p_scriptName)
	{
		this.logToFile = p_logToFile;
		this.logToIDE = p_logToIDE;
		this.logFilePath = p_logFilePath;
		this.jobID = p_jobID;
		this.scriptName = p_scriptName;

		if ( this.logToIDE )
		{
			fl.outputPanel.clear();
		}
	},

	/**
	 * Log a message.
	 *
	 * @param p_logItem String to log.
	 * @param p_type String specifying the type of message, i.e. SYSTEM, WARNING or CRITICAL.
	 *
	 * @return Void.
	 */
	log : function(p_logItem,p_type)
	{
		var output = this.jobID+" "+this.scriptName+" "+Utils.getTimeStamp();

		if ( !p_type || p_type === "" )
		{
			output = this.SYSTEM+" "+output;
		}
		else
		{
			output = p_type+" "+output;
		}

		output = output+" > "+p_logItem;

		if ( this.logToIDE )
		{
			fl.outputPanel.trace(output);
		}

		FLfile.write(this.logFilePath,output+"\n","append");
	}
};