/**
 * Publishes the current document, plus all
 * the documents to the right of the current tab, and
 * closes all swf windows, except the last published swf.
 */
var l = fl.documents.length;
var firstIndex = fl.findDocumentIndex(fl.getDocumentDOM().name);
var count = firstIndex - 1;
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
fl.setActiveWindow(fl.documents[firstIndex]);