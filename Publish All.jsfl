/**
   Flash JSAPI Source File -- Created with SAPIEN Technologies PrimalScript 3.1
   
   @author César Tardáguila Moro
   @codehint 
   @example 
   @tooltip 
*/


var num = fl.documents.length;
for (var k = 0; k<num; k++){
	fl.documents[k].publish();
}
