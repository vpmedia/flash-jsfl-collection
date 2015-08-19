/**
 * Publishes all open documents, and closes all swf
 * windows, except the last published SWF.
 */
var l = fl.documents.length;
var count = -1;
function publishNext()
{
	count++;
	if(count == l) return;
	else if(count == l - 1) fl.closeAllPlayerDocuments();
	fl.setActiveWindow(fl.documents[count]);
	fl.getDocumentDOM().testMovie();
	publishNext();
}
publishNext();