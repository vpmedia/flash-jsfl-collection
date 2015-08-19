function FLPBuilder(aFolders){
	
	this.__folders = aFolders;
}


FLPBuilder.prototype.getXML = function(){

	var i = 0;
	var len = this.__folders.length;		
	var s = "";
	
	s += ('<flash_project name="Installed AS Files" version="1">');
	while(i<len){
		s += this.buildFolders(fl.configURI + this.__folders[i], this.__folders[i], "");
		i++;
	}
	s += ('</flash_project>');
	
	return s;
}


FLPBuilder.prototype.buildFiles = function(sPath, s){

	// loop through files
	var files = FLfile.listFolder(sPath, "files");
	var i = 0;
	var len = files.length;	
	var path;
 	while (i<len) {
		if(files[i].indexOf(".as") != -1){
			path = unescape(sPath + "/" + files[i]);
			path = path.replace("file:///", "");
			 s +=('<project_file filetype="as" path="'+ path.replace("|", ":")+'"/>');
		}
		i++;
	}	
	
	return s;
}


FLPBuilder.prototype.buildFolders = function(sPath, sFolder, s){
	
	var dirs = FLfile.listFolder(sPath,"directories");
	var i = 0;
	var len = dirs.length;
	// add directory
	s +=('<project_folder expanded="false" name="'+sFolder+'">');
	// loop through sub directories
	while (i<len) {
		if(dirs[i] != "aso"){
			s += this.buildFolders(sPath + "/" + dirs[i], dirs[i], "");
		}
		i++;
	}
	s += this.buildFiles(sPath, "");
	s +=('</project_folder>');
	
	return s; 
}
 



var TEMP_FLP_PATH = fl.configURI + "Commands/TEMP/"; 
var TEMP_FLP_FILE = "Test.flp";

// Build .flp xml string
var flp = new FLPBuilder(["Classes", "Include"]);
// Create TEMP directory in commands to place .flp file
if(FLfile.exists(TEMP_FLP_PATH)){
     FLfile.remove(TEMP_FLP_PATH);
}
FLfile.createFolder(TEMP_FLP_PATH);
// Write temp .flp file
FLfile.write(TEMP_FLP_PATH + TEMP_FLP_FILE,  flp.getXML());
// Open temp .flp file
fl.openProject( TEMP_FLP_PATH + TEMP_FLP_FILE);


