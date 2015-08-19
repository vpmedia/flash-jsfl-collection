/**
 * Organizes all library items - folders get 
 * created for each item type and items get moved into those folders.
 */

//possible item types:
//undefined,component,movie clip,
//graphic,button,folder,font,
//sound,bitmap,compiled clip,screen,video

var lib = fl.getDocumentDOM().library;
function makeFolders()
{
	lib.newFolder("movieclips");
	lib.newFolder("fonts");
	lib.newFolder("sounds");
	lib.newFolder("graphics");
	lib.newFolder("bitmaps");
	lib.newFolder("components");
	lib.newFolder("videos");
	lib.newFolder("buttons");
}
makeFolders();
function moveMovieClip(item){lib.moveToFolder("movieclips",item.name,false);}
function moveBitmap(item){lib.moveToFolder("bitmaps",item.name,false);}
function moveSound(item){lib.moveToFolder("sounds",item.name,false);}
function moveGraphic(item){lib.moveToFolder("graphics",item.name,false);}
function moveButton(item){lib.moveToFolder("buttons",item.name,false);}
function moveFont(item){lib.moveToFolder("fonts",item.name,false);}
function moveVideo(item){lib.moveToFolder("videos",item.name,false);}
function moveComponent(item){lib.moveToFolder("components",item.name,false);}
var items = fl.getDocumentDOM().library.items;
var i=0;
var l=items.length;
var missed = false;
for(i;i<l;i++)
{
	var item = items[i];
	if(item.name.indexOf("Component Assets")>-1) continue;
	if(item.name.indexOf("FLV Playback Skins")>-1) continue;
	if(item.name.indexOf("movieclips")>-1) continue;
	if(item.name.indexOf("bitmaps")>-1) continue;
	if(item.name.indexOf("buttons")>-1) continue;
	if(item.name.indexOf("components")>-1) continue;
	if(item.name.indexOf("fonts")>-1) continue;
	if(item.name.indexOf("graphics")>-1) continue;
	if(item.name.indexOf("sounds")>-1) continue;
	if(item.name.indexOf("videos")>-1) continue;
	switch(items[i].itemType)
	{
		case "undefined":
			continue;
		case "movie clip":
			moveMovieClip(item);
			break;
		case "bitmap":
			moveBitmap(item);
			break;
		case "sound":
			moveSound(item);
			break;
		case "graphic":
			moveGraphic(item);
			break;	
		case "button":
			moveButton(item);
			break;
		case "font":
			moveFont(item);
			break;
		case "video":
			moveVideo(item);
			break;
		case "component":
			moveComponent(item);
			break;
		case "folder":
			continue;
	}
}
lib.selectNone();
lib.editItem();
if(missed) alert("Some items could not be organized.");