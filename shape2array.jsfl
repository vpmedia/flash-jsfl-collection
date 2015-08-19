/**
*
* this script only works under certain conditions:
*		- everything that is selected must be shapes, if not, this doesn't work (select all and ctrl+b (break))
* 		- every shape has to be in a different layer, otherwise the script see it as one shape
*
* The result of this jsfl is not always what you expect...
* 		sometimes geometric shapes like squares/rectangles/triangles are all f#$%ed-up (it looks like curves are made to opposite corners)
* 		I have no solution for that in this jsfl (in the code), it seems that Flash 'reads' the shape wrong (or in the wrong order)...
*		But you could try: 	- I used the straighten tool which worked in one case, but not in the other
*						- rotated a square 90 degrees
*						- both solutions
*
*
*
* based upon 		http://ericlin2.tripod.com/bugwire/bugwiret.html
* and			http://livedocs.adobe.com/flash/9.0/main/wwhelp/wwhimpl/common/html/wwhelp.htm?context=LiveDocs_Parts&file=00003869.html
*
* <pre>
*  ____                   _      ____
* |  __| _ __ ___    ___ | | __ |__  |
* | |   | '_ ` _ \  / __|| |/ /    | |
* | |   | | | | | || (__ |   <     | |
* | |__ |_| |_| |_| \___||_|\_\  __| |
* |____|                        |____|
*
* </pre>
*
*
* @author			Matthijs C. Kamstra [mck]
* @version		1.1
* @since			10:00 5-5-2008
*
* Changelog:
* 		v1.1 [2008-05-09] - test movie after use of this jsfl
* 		v1.0 [2008-05-05] - Initial release
*
*
*/
var currentVersion = '1.1';

fl.trace ('[mck] shape2Array :: version ' + currentVersion);

// with a shape selected
var ptArray = [];
var doneEdge = [];
var exportString = 'var shapeArrayz:Array = new Array ();\n';
var selectionNumber = 0;

// fl.trace("// start ---------------------------");
function isDrawn(id) {
	for (var k = 0; k<doneEdge.length; k++) {
		if (doneEdge[k] == id) {
			return true;
		}
	}
	return false;
}

sel = fl.getDocumentDOM().selection;
for (var n = 0; n < sel.length; n++) {

	exportString += 'shapeArrayz['+n+'] = [';
	selectionNumber = sel.length;

	var elt = sel[n];
	if (elt.elementType != 'shape') {
		continue;
	}
	elt.beginEdit();
	for (i=0; i<elt.contours.length; i++) {
		var cont = elt.contours[i];
		var he = cont.getHalfEdge();
		var startId = he.id;
		var id = 0;
		while (id != startId) {
			var ed = he.getEdge();
			if (!isDrawn(ed.id)) {
				doneEdge.push(ed.id);
				for (var j = 0; j<3; j++) {
					var pt = ed.getControl(j);
					ptArray.push(pt.x, pt.y , j);
					exportString += '[' + pt.x + ',' + pt.y + ',' + j + '] , ';
				}
			}
			he = he.getNext();
			id = he.id;
		}
	}
	elt.endEdit();
	exportString += '];\n';
}
// fl.trace(ptArray);
// fl.trace("// end ---------------------------");

// I'm a lazy bastard, so paste the code in the as layer
// create or place code in 'as' layer
var tl = fl.getDocumentDOM().getTimeline();
if (tl.findLayerIndex("as") == undefined){
	tl.addNewLayer('as', 'normal' , true);
} else {
	tl.currentLayer = tl.findLayerIndex("as")[0];
}
tl.layers[tl.currentLayer].frames[0].actionScript = exportString.split('] , ];').join(']];') + "\n";

// The following example tests the movie for the current document:
fl.getDocumentDOM().testMovie(); // if you don't want to export to swf after the jsfl is ready, comment this line

// end jsfl
