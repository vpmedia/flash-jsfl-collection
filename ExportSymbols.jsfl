/**
 * Export for ActionScript selected library items.
 * Support exporting MovieClips, Bitmaps, Sounds and Fonts.
 * Copyright (c) 2014 flaxe. All rights reserved.
 */

var spriteClass = 'flash.display.Sprite';
var movieClipClass = 'flash.display.MovieClip';
var buttonClass = 'flash.display.SimpleButton';
var bitmapDataClass = 'flash.display.BitmapData';
var soundClass = 'flash.media.Sound';
var fontClass = 'flash.text.Font';

var doc = fl.getDocumentDOM();
var exportPackage = "";
var exportAssets = false;

if (!doc) {
	alert('Please open or create a document.');
} else {
	var selectedItems = fl.getDocumentDOM().library.getSelectedItems();
	if (selectedItems.length == 0) {
		alert('Please select one or more symbols in library to export.');
	} else {
		exportItems(selectedItems);
	}
}

function exportItems(items)
{
	var dialog = createUIDialog();
	if (dialog.dismiss == 'accept') {
		exportPackage = dialog.package;
		exportAssets = dialog.exportAssets == 'true';
		for (var i = 0; i < items.length; i++) {
			exportItem(items[i]);
		}
	}
}

function exportItem(item)
{
	switch (item.itemType) {
		case 'movie clip':
			exportSymbol(item, item.timeline.frameCount > 1 ? movieClipClass : spriteClass);
			break;
		case 'button':
			exportSymbol(item, buttonClass);
			break;
		case 'bitmap':
			if (exportAssets) exportSymbol(item, bitmapDataClass);
			break;
		case 'sound':
			if (exportAssets) exportSymbol(item, soundClass);
			break;
		case 'font':
			if (exportAssets) exportSymbol(item, fontClass);
			break;
	}
}

function exportSymbol(item, baseClass)
{
	item.linkageExportForAS = true;
	item.linkageExportInFirstFrame = true;
	item.linkageBaseClass = baseClass;
	item.linkageClassName = (exportPackage ? exportPackage + "." : "") + getItemPackage(item) + getItemName(item);
}

function getItemPackage(item)
{
	var id = item.name.lastIndexOf('/');
	if (id != -1) {
		var pack = item.name.slice(0, id);
		return formatPackage(pack).toLowerCase();
	} else {
		return "";
	}
}

function formatPackage(pack)
{
	pack = pack.replace(/[\s]/g, '');
	pack = pack.replace(/\.\w+/g, '');
	pack = pack.replace(/[\/]/g, '.');
	return pack + '.';
}

function getItemName(item)
{
	var id = item.name.lastIndexOf('/');
	var name = (id != -1) ? item.name.slice(id + 1) : item.name;
	return formatName(name);
}

function formatName(name)
{
	return name.replace(/\s/g, '');
}

function createUIDialog()
{
	var xml = '<?xml version="1.0"?>'
	+ '<dialog buttons="accept, cancel"  title="Export Symbols" >'
	+ '<hbox><label value="Package:" /><textbox id="package" value="" size="32" /></hbox>'
	+ '<hbox><checkbox id="exportAssets" label="Export Assets" checked="false" /></hbox>'
	+ '</dialog>';
	var url = fl.configURI + 'Commands/TempExportDialog' + parseInt(9999 * Math.random()) + '.xml';
	FLfile.write(url, xml);
	var output = fl.getDocumentDOM().xmlPanel(url);
	FLfile.remove(url);
	return output;
}