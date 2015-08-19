/****************************************************
 * Set the desired publish profile properties in    *
 * the flash IDE. Run this script from the Commands *
 * Menu and cut and paste the output from into the  *
 * export script                                    *
 * Some modification will need to be made to take   *
 * the width, height and name of each item. See the *
 * export script for an example                     *
 *                                                  *
 * Author: C.Wilson - abitofcode                    *
 * Date: 19-11-2011                                 *
 ****************************************************/
 
// clear the output window
fl.outputPanel.clear()

// Get a path to save the current profile information into
var saveDir = fl.browseForFolderURL("Save your profile template where:")
var profFile = saveDir + '/pubprofile_template.xml'

// Export the current publish profile
fl.getDocumentDOM().exportPublishProfile(profFile);

// Read the profile we have exported back into a string
var str = FLfile.read( profFile);
if (str) {
    // Split the profile XML by line break
    var lines = str.split("\n");

    // Start building the profile string that we'll use in 
    // the export script.
    var profileString = "\tprofile = ";
    
    // loop through each line formatting for use in the template
    for(line in lines){
        if(lines[line]) {
            profileString += "\t'" + lines[line] + "\\n' + \n";        
        }
    }
  
    // Output the profile string to the output window so we can
    // cut and paste into the export script
    fl.trace(profileString);
}





