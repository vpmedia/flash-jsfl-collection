/**
 * Deletes all graphic symbols from the library.
 */
var dom = fl.getDocumentDOM();
var items = dom.library.items;
var lib= dom.library;
for(var i=0;i<items.length;i++) if(items[i].itemType=="graphic") lib.deleteItem(items[i].name);