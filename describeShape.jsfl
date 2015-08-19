	
function getInstances() {
	// Clear 
	
	var animationData=true;
	
	fl.outputPanel.clear();
	var timeline = fl.getDocumentDOM().getTimeline();
	//var tframes=timeline.getSelectedFrames();
	// Check every layer
	var currentframe=timeline.currentFrame;
	var totalLayers=timeline.layerCount;
	//fl.getDocumentDOM().getTimeline().layers[0].frames[0].elements[0].name = "clip_
	
	//tElements=timeline.getFrameProperty("elements",currentframe);
	var tString="";
	var tElementList="";
	var unnamedElements=0;
	var currentShape=0;
	// String to create the clip
	//fl.trace("this.createEmptyMovieClip(\"drawClip\",1);");
	//fl.trace("drawClip.lineStyle(1,0xFFFFFF,100);");
	fl.trace("import wilberforce.util.drawing.drawingagent.drawingAgentSystem;");
	fl.trace("var allEdgesArray:Array=new Array()");
	for (var i=0;i<totalLayers;i++) {
		//tString+="LAYER "+i+"\n";

		var tElements=timeline.layers[i].frames[currentframe].elements;
		for (var j=0;j<tElements.length;j++) {			
			var tElement=tElements[j];
			if (tElement.elementType=="shape") {
				// Get position etc
				var tMatrix=tElement.matrix;
				var tEdges=tElement.edges;
				var tVertices=tElement.vertices;
				var tContours=tElement.contours;
				fl.trace("//Edges : "+tEdges.length+" - Vertices "+tVertices.length+" - Contours "+tContours.length);
				// Vertices : x,y
				// Edge : 
				var drawnEdgeArray=[];
				// Process each CONTOUR!
				for (var i=0;i<tContours.length;i++) {
					var tContour=tContours[i];
					// Does it enclose an area?
					var tEnclosed=false;
					if (tContour.interior) tEnclosed=true;
					// Select the contour to get its stroke data
					fl.getDocumentDOM().selection = [tElement];
					var stroke = fl.getDocumentDOM().getCustomStroke("selection");
					//fl.trace("Stroke colour is "+stroke.color);
//					tHexColor="0x"+stroke.color.substring(2,8);
					
					fl.trace("// ---- Beginning shape : Fill-"+tEnclosed+" --------")
					if (animationData) fl.trace("var edgeData"+currentShape+"=[]");
//					if (animationData) fl.trace("edgeData"+currentShape+".push({type:drawingAgentSystem.LINESTYLE,color:"+tHexColor+",thickness:"+stroke.thickness+"})");

					// Start at the beginning, and use getEdge to continue to process the contour
					var tHalfEdge=tContour.getHalfEdge();
					var tStartId=tHalfEdge.id;
					//var id = 0;
					//fl.trace("ID is "+id);
					// Make sure its not been visited
					var visitedArray=[];
					//visitedArray.push(tStartId);
					var id=tStartId;
					var lastHalfEdge=null;
					tComplete=false;
					//while (id != tStartId){					
					//while (!checkExists(visitedArray,id)) {
					// Whatever happens, the first point is a Moveto
					var vrt = tHalfEdge.getVertex();
					//fl.trace("MOVE : "+vrt.x+","+vrt.y);
					
					if (animationData) fl.trace("edgeData"+currentShape+".push({type:drawingAgentSystem.MOVE,x:"+vrt.x+",y:"+vrt.y+"});");
					else fl.trace("drawClip.moveTo("+vrt.x+","+vrt.y+");");
					// DONT add to the array any more to allow them to be closed
					//visitedArray.push(vrt);
					// Get the first vertex to describe the line its moving to					
					lastHalfEdge=tHalfEdge;
					tHalfEdge = tHalfEdge.getNext();
					
					while (!tComplete) {
						// get the next vertex
						//visitedArray.push(id);						
						//fl.trace("ID is "+id);
						var vrt = tHalfEdge.getVertex();
						var tEdge=tHalfEdge.getEdge()
						var tCurrentEdgeId=tEdge.id;
						// Check to see if this edge has been drawn
						var drawEdge=true;
						if (checkExists(drawnEdgeArray,tCurrentEdgeId)) {
							//fl.trace("EDGE ALREADY DRAWN "+tCurrentEdgeId);
							drawEdge=false;
						}
						drawnEdgeArray.push(tCurrentEdgeId);
						
						var x = vrt.x;
						var y = vrt.y;
						
						
						//if (checkExists(visitedArray,vrt)) {
						if (checkDuplicateVertex(visitedArray,vrt)) {
							tComplete=true;
							
							// Attach the animation system
							if (animationData) {
								//fl.trace("var tData"+currentShape+"={edgeData:edgeData"+currentShape+"}");
								//fl.trace("var contourClip"+currentShape+"=this.attachMovie(\"contourDrawSystem\",\"contour"+currentShape+"\","+(100+currentShape)+",tData"+currentShape+");");
								fl.trace("allEdgesArray.push(edgeData"+currentShape+");");
							}
							fl.trace("// --- End of shape -----");
							currentShape++;
						}
						else {
							// Get the corresponding edge
							
							if (tEdge.isLine) {
								//fl.trace("LINE: - " + x + ", " + y);
								if (drawEdge) {
									if (animationData) fl.trace("edgeData"+currentShape+".push({type:drawingAgentSystem.LINE,x:"+x+",y:"+y+"});");
									else fl.trace("drawClip.lineTo("+x+","+y+");");
								}
							}
							else {
								// Get the control point
								var tControlPoint=tEdge.getControl(1);
								if (drawEdge) {
									if (animationData) fl.trace("edgeData"+currentShape+".push({type:drawingAgentSystem.CURVE,cx:"+tControlPoint.x+",cy:"+tControlPoint.y+",ax:"+vrt.x+",ay:"+vrt.y+"});");
									else fl.trace("drawClip.curveTo("+tControlPoint.x+","+tControlPoint.y+","+x+","+y+");");							
								}
							}
							visitedArray.push(vrt);
							lastHalfEdge=tHalfEdge;
							tHalfEdge = tHalfEdge.getNext();
							//id = tHalfEdge.id;		
						}										
					}
					
				}
				
				
				
				// Process each edge?
				/*
				for (var i=0;i<tEdges.length;i++) {
					var tEdge=tEdges[i];
					var p1=tEdge.getControl(0);
					var p3=tEdge.getControl(2);
					if (tEdge.isLine) {
						// Straight line
					}
					else {
						// Curved line
						
						var tControlPoint=tEdge.getControl(1);
					}
				}
				*/
				// WHats a half edge
			}
			/*
			if (tElement.name.length>0) {
				tString+="Found  : "+tElements[j].name+"\n";
				tElementList+=tElements[j].name+"~";
			}
			else {
				unnamedElements++;
			}
			*/
			
		}
	}
	
	// Put out the name of all the contourDrawSystem
	var contourString="var contourArray=["
	for (var i=0;i<currentShape;i++) {
		if (i>0) contourString+=",";
		contourString+="contourClip"+i;
		
	}
	contourString+="];";
	//tString+="Unnamed elements :"+unnamedElements;
	//fl.trace("// All contour array here");
	//fl.trace(contourString);
	//alert(tElementList);
	//alert(tString);
	//fl.trace("ELEMENTS :"+tElementList+"\n");
	return tElementList;
	//fl.trace("Current frames "+tframes);
}

function checkExists(tArray,tValue) {
	for (var i=0;i<tArray.length;i++) {
		var tTestValue=tArray[i];
		if (tTestValue==tValue) {
			//fl.trace("FOUND! "+tTestValue+" : "+tValue)
			return true
		}
	}
//	fl.trace("not found");
	return false;
}
function checkDuplicateVertex(tArray,tVertex) {
	for (var i=0;i<tArray.length;i++) {
		var tTestVertex=tArray[i];
		if (tTestVertex.x==tVertex.x && tTestVertex.y==tVertex.y) {
			return true
		}
	}
	return false;
}

getInstances();