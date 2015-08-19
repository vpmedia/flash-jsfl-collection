var doc = fl.getDocumentDOM();
var panel = doc.xmlPanel(fl.configURI + "Commands/Insert.xml");

var selectionArray = {trade:"™", copy:"©", reg:"®", bullet:"•", apos:"’"};

if (panel.dismiss == "accept")
{
	var insert = selectionArray[panel.choices];
	var txt = doc.selection[0];
	var origStart = txt.selectionStart;
	var origEnd = txt.selectionEnd;
	txt.setTextString(insert, origStart, origEnd);
	
	doc.setTextSelection(origStart, origStart + insert.length);
	var newEnd = origStart + insert.length;
	
	if (panel.superscript == "true") txt.setTextAttr("characterPosition", "superscript", origStart, newEnd); 
}