////////////////////////////////////////////////////////////////////////////////
// func_autodoc.jsfl
//    javadoc-style automatic comment generation tool
// 
// author: g.wygonik - with thanks to guy watson for the first few lines
//         taken from his "Insert Stop Frames" code. :-)
//
// comments, enhancements, or hate mail: gw@artificialcolors.com
////////////////////////////////////////////////////////////////////////////////

var dom = fl.getDocumentDOM();
var timeline = dom.getTimeline();
var selections = timeline.getSelectedFrames();
var layer = selections[0];
var frame = selections[1];
var as = timeline.layers[layer].frames[frame].actionScript;
var asArr = as.split("\n");
var asArrL = asArr.length;
var asF = "";
var prevDone = false;
for (s=0; s<asArrL; s++) {
	var asE = asArr[s].split(" ").join("");
	var LL = "";
	var tmpLL = asArr[s].toLowerCase().split("function")[0].split("");
	for (L=0;L<tmpLL.length;L++) {
		if ( (tmpLL[L] != " ") && (tmpLL[L] != "\t") ) {
			break;
		} else {
			LL += tmpLL[L];
		}
	}
	if ((asE.indexOf("function")>-1) && (asE.indexOf("=function")<0) && (asE.indexOf("*function")<0) && (asE.indexOf("//function")<0)) {
		if (s>0) {
			if (asArr[s-1].indexOf("*/")<0) {
				prevDone = false;
			} else {
				prevDone = true;
			}
		}
		if (!prevDone) {
			var asTMP = asArr[s];
			var jd = LL + "/**\n";
			var fname = asArr[s].split("function")[1].split("(")[0];
			jd += LL + " * FUNCTION: "+fname+"\n";
			jd += LL + " *\n";
			jd += LL + " * function description here\n";
			if (asE.indexOf("()")<0) {
				jd += LL + " *\n";
				var params = asArr[s].split("function")[1].split("(")[1].split(")")[0].split(" ").join("").split(",");
				if (params.length>0) {
					for (p=0; p<params.length; p++) {
						var tmpP = params[p].split(":");
						if (tmpP[1] == "") {
							tmpP[1] = "undefined";
						}
						if (tmpP[0].indexOf(" ") == 0) {
							tmpP[0] = tmpP[0].split(" ")[1];
						}
						jd += LL + " * @param   "+tmpP[0]+"   "+tmpP[1]+"   ** param description here\n";
					}
				}
			}
			if (asE.indexOf("):")>0) {
				jd += LL + " *\n";
				jd += LL + " * @return  "+asE.split("):")[1].split("{")[0]+"\n";
			}
			jd += LL + " *\n";
			jd += LL + "**/\n";
			asArr[s] = jd+asTMP;
		}
	}
	asF += asArr[s];
}
timeline.layers[layer].frames[frame].actionScript = asF;
