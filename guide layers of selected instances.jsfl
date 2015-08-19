/**
 * Guide's all layers from the selected items on the stage.
 */
var dom=fl.getDocumentDOM();
var selection=dom.selection;
var i=0;
var l=selection.length;
for(i;i<l;i++)selection[i].layer.layerType="guide";