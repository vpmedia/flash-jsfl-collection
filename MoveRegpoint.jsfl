/////////////////////////////////////////////////////////////////////////
//
//	MoveRegpoint.jsfl
//
//	version 1.1
//	23.12.2004
//
//	programmed by klaas kielmann
//	copyright 2004 by kosmokrator.com


if ( flash.documents.length == 0 ) {
	alert( "Please open a flash document first." );

} else if ( ( flash.getDocumentDOM().selection.length != 1 ) || ( flash.getDocumentDOM().selection[ 0 ].elementType != "instance" ) ) {
	alert( "Please select a single symbol instance and retry command." );

} else {
	var doc = flash.getDocumentDOM();
	var tim	= doc.getTimeline();
	var sel = doc.selection;
	var obj = sel[ 0 ];
	var layer = tim.currentLayer;
	var frame = tim.currentFrame;
	var name = obj.libraryItem.name;
	var offset = doc.getTransformationPoint();
	doc.enterEditMode( "inPlace" );
	MoveContent( { x: - offset.x, y: - offset.y } );
	doc.exitEditMode();
	doc.selectNone();
	MoveSymbols( name, offset );
	tim.setSelectedLayers( layer );
	tim.setSelectedFrames( frame, frame );
	doc.selectNone();
}

function MoveContent( this_point ) {
	var is_locked = false;
	var timeline = doc.getTimeline();
	var layers = timeline.layers;
	for ( var i = 0; i < layers.length; i++ ) {
		is_locked = layers[ i ].locked;
		layers[ i ].locked = false;
		var frames = layers[ i ].frames;
		for ( var j = 0; j < frames.length; j++ ) {
			if ( frames[ j ].startFrame == j ) {
				timeline.setSelectedLayers( i );
				timeline.setSelectedFrames( j, j );
				if ( frames[ j ].elements.length ) {
					doc.group();
					if ( doc.selection.length > 0 ) {
						doc.moveSelectionBy( this_point );
					}
					doc.unGroup();
				}
				doc.selectNone();
			}
		}
		layers[ i ].locked = true;
	}
}

function MoveSymbols( this_name, this_point ) {
	var selection = new Array();
	var timeline = doc.getTimeline();
	var layers = timeline.layers;
	for ( var i = 0; i < layers.length; i++ ) {
		if ( ! layers[ i ].locked ) {
			var frames = layers[ i ].frames;
			for ( var j = 0; j < frames.length; j++ ) {
				if ( frames[ j ].startFrame == j ) {
					timeline.setSelectedLayers( i );
					timeline.setSelectedFrames( j, j );
					var elements = frames[ j ].elements;
					for ( var c = 0; c < elements.length; c++ ) {
						var element = elements[ c ];
						if ( element.elementType == "instance" && element.libraryItem.name == this_name && !element.locked ) {
							doc.selectNone();
							doc.selection = [ element ];
							if ( doc.selection.length == 1 ) {
								doc.setTransformationPoint( { x: 0, y: 0 } );
								doc.moveSelectionBy( this_point );
							}
						}
					}
					doc.selectNone();
				}
			}
		}
	}
}
