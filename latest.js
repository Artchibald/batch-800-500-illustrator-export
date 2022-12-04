alert(" \n\nMake sure you don't have/delete the folder called images with wtw_logo.ai inside the all icons folder this will break the script. \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/batch-800-500-illustrator-export   \n\n  This script relates to this other script: https://github.com/Artchibald/2022_icon_rebrand_scripts. It is an addon built on top to run a batch export of the 800x500 no text. \n\nVideo set up tutorial available here: https://youtu.be/XXXXXXXXXXXXXX. \n\nOpen Illustrator but don't open a document. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Illustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes of 1 and 2 must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease try to use underscore instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");
var i;
var expressiveName = "Expressive";
var coreName = "Core";
var croppedName = "Cropped";
var pngName = "png";
var svgName = "svg";
var exportSizes = [1024, 512, 256, 128, 64, 48, 32, 24, 16]; //sizes to export
// reusable functions we need
var CSTasks = (function () {
    var tasks = {};
    tasks.newRect = function (x, y, width, height) {
        var rect = [];
        rect[0] = x;
        rect[1] = -y;
        rect[2] = width + x;
        rect[3] = -(height + y);
        return rect;
    };
    tasks.selectContentsOnArtboard = function (sourceDoc, i) {
        sourceDoc.selection = null;
        sourceDoc.artboards.setActiveArtboardIndex(i);
        sourceDoc.selectObjectsOnActiveArtboard();
        return sourceDoc.selection;
    };
    //takes a document and a collection of objects (e.g. selection)
    //returns a group made from that collection
    tasks.createGroup = function (sourceDoc, collection) {
        var newGroup = sourceDoc.groupItems.add();
        for (i = 0; i < collection.length; i++) {
            collection[i].moveToBeginning(newGroup);
        }
        return newGroup;
    };
    tasks.getArtboardCorner = function (artboard) {
        var corner = [artboard.artboardRect[0], artboard.artboardRect[1]];
        return corner;
    };
    //takes an array [x,y] for an item's position and an array [x,y] for the position of a reference point
    //returns an array [x,y] for the offset between the two points
    tasks.getOffset = function (itemPos, referencePos) {
        var offset = [itemPos[0] - referencePos[0], itemPos[1] - referencePos[1]];
        return offset;
    };
    //takes an object (e.g. group) and a destination array [x,y]
    //moves the group to the specified destination
    tasks.translateObjectTo = function (object, destination) {
        var offset = tasks.getOffset(object.position, destination);
        object.translate(-offset[0], -offset[1]);
    };
    //take a source document, artboard index, and a colorspace (e.g. DocumentColorSpace.RGB)
    //opens and returns a new document with the source document's units and specified artboard, the specified colorspace
    tasks.duplicateArtboardInNewDoc = function (sourceDoc, artboardIndex, colorspace) {
        var rectToCopy = sourceDoc.artboards[artboardIndex].artboardRect;
        var newDoc = tasks.newDocument(sourceDoc, colorspace);
        newDoc.artboards.add(rectToCopy);
        newDoc.artboards.remove(0);
        return newDoc;
    };
    //takes a group
    //ungroups that group at the top layer (no recursion for nested groups)
    tasks.ungroupOnce = function (group) {
        for (i = group.pageItems.length - 1; i >= 0; i--) {
            group.pageItems[i].move(group.pageItems[i].layer, 
            /*@ts-ignore*/
            ElementPlacement.PLACEATEND);
        }
    };
    /****************************
      CREATING AND SAVING DOCUMENTS
      *****************************/
    //take a source document and a colorspace (e.g. DocumentColorSpace.RGB)
    //opens and returns a new document with the source document's units and the specified colorspace
    tasks.newDocument = function (sourceDoc, colorSpace) {
        var preset = new DocumentPreset();
        /*@ts-ignore*/
        preset.colorMode = colorSpace;
        /*@ts-ignore*/
        preset.units = sourceDoc.rulerUnits;
        /*@ts-ignore*/
        var newDoc = app.documents.addDocument(colorSpace, preset);
        newDoc.pageOrigin = sourceDoc.pageOrigin;
        newDoc.rulerOrigin = sourceDoc.rulerOrigin;
        return newDoc;
    };
    //takes a document, destination file, starting width and desired width
    //scales the document proportionally to the desired width and exports as a PNG
    tasks.scaleAndExportPNG = function (doc, destFile, startWidth, desiredWidth) {
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsPNG24();
        /*@ts-ignore*/
        options.antiAliasing = true;
        /*@ts-ignore*/
        options.transparency = true;
        /*@ts-ignore*/
        options.artBoardClipping = true;
        /*@ts-ignore*/
        options.horizontalScale = scaling;
        /*@ts-ignore*/
        options.verticalScale = scaling;
        doc.exportFile(destFile, ExportType.PNG24, options);
    };
    //takes a document, destination file, starting width and desired width
    //scales the document proportionally to the desired width and exports as a SVG
    tasks.scaleAndExportSVG = function (doc, destFile, startWidth, desiredWidth) {
        var scaling = (100.0 * desiredWidth) / startWidth;
        var options = new ExportOptionsSVG();
        /*@ts-ignore*/
        options.horizontalScale = scaling;
        /*@ts-ignore*/
        options.verticalScale = scaling;
        // /*@ts-ignore*/
        // options.transparency = true;
        /*@ts-ignore*/
        // options.compressed = false; 
        // /*@ts-ignore*/
        // options.saveMultipleArtboards = true;
        // /*@ts-ignore*/
        // options.artboardRange = ""
        // options.cssProperties.STYLEATTRIBUTES = false;
        // /*@ts-ignore*/
        // options.cssProperties.PRESENTATIONATTRIBUTES = false;
        // /*@ts-ignore*/
        // options.cssProperties.STYLEELEMENTS = false;
        // /*@ts-ignore*/
        // options.artBoardClipping = true;
        doc.exportFile(destFile, ExportType.SVG, options);
    };
    return tasks;
})();
// end reusable functions
// refs
// https://gist.github.com/joonaspaakko/df2f9e31bdb365a6e5df
// Finds all .ai files from the input folder + its subfolders 
var overwrite = true; // boolean
if (app.documents.length > 0) {
    alert("ERROR: \n Close all documents before running this script.");
}
// Run the script
else {
    var files, folder = Folder.selectDialog("Please select the folder where the icons are saved");
    // If folder variable return null, user most likely canceled the dialog or
    // the input folder and it subfolders don't contain any .ai files.
    if (folder != null) {
        // returns an array of file paths in the selected folder.
        files = GetFiles(folder);
        //alert(files);
        // This is where things actually start happening...
        process(files);
    }
}
function process(files) {
    // Loop through the list of .ai files:
    // Open > Save > Close > LOOP
    var i;
    var _loop_1 = function () {
        // Current file
        file = files[i];
        // Open
        app.open(file);
        // If overwrite is false, create a new file, otherwise use "file" variable;
        //  file = !overwrite ? new File(file.toString().replace(".ai", " (legacyFile).ai")) : file;
        // custom actions starts here
        sourceDoc = app.activeDocument;
        var iconFilename = sourceDoc.name.split(".")[0];
        // vars needed for exporting
        var sourceDocName = sourceDoc.name.slice(0, -3);
        //this works here: alert(sourceDoc.name);
        // create 800x500 artboard in file
        var ThirdMainArtboardFirstRect = sourceDoc.artboards[1].artboardRect;
        sourceDoc.artboards.add(
        // this fires but then gets replaced further down
        CSTasks.newRect(ThirdMainArtboardFirstRect[1], 370, 800, 500));
        //select the contents on artboard 1
        var selThirdBanner = CSTasks.selectContentsOnArtboard(sourceDoc, 1);
        // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
        app.executeMenuCommand('Colors9');
        if (selThirdBanner.length == 0) {
            //if nothing is in the artboard
            alert("Please try again with artwork on the main second 256x256 artboard.");
            return { value: void 0 };
        }
        /********************************
        Add elements to new third artboard with lockup
        *********************************/
        var iconGroup = CSTasks.createGroup(sourceDoc, selThirdBanner); //group the selection (easier to work with)
        var iconOffset = CSTasks.getOffset(iconGroup.position, CSTasks.getArtboardCorner(sourceDoc.artboards[1]));
        //place icon on lockup
        /*@ts-ignore*/
        var thirdBannerMast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
        var thirdBannerMastPos = [
            sourceDoc.artboards[2].artboardRect[0] + iconOffset[0],
            sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
        ];
        CSTasks.translateObjectTo(thirdBannerMast, thirdBannerMastPos);
        var getArtLayer5 = sourceDoc.layers.getByName('Art');
        var landingZoneSquare = getArtLayer5.pathItems.rectangle(-2024, 352, 456, 456);
        function placeIconLockup1Correctly5(thirdBannerMast, maxSize) {
            // uncomment to show landing square
            // let setLandingZoneSquareColor = new RGBColor();
            // setLandingZoneSquareColor.red = 121;
            // setLandingZoneSquareColor.green = 128;
            // setLandingZoneSquareColor.blue = 131;
            // landingZoneSquare.fillColor = setLandingZoneSquareColor;
            landingZoneSquare.name = "LandingZone2";
            landingZoneSquare.filled = false;
            /*@ts-ignore*/
            landingZoneSquare.move(getArtLayer5, ElementPlacement.PLACEATEND);
            // start moving expressive icon into our new square landing zone
            var placedthirdBannerMast = thirdBannerMast;
            var landingZone = sourceDoc.pathItems.getByName("LandingZone2");
            var preferredWidth = (456);
            var preferredHeight = (456);
            // do the width
            var widthRatio = (preferredWidth / placedthirdBannerMast.width) * 100;
            if (placedthirdBannerMast.width != preferredWidth) {
                placedthirdBannerMast.resize(widthRatio, widthRatio);
            }
            // now do the height
            var heightRatio = (preferredHeight / placedthirdBannerMast.height) * 100;
            if (placedthirdBannerMast.height != preferredHeight) {
                placedthirdBannerMast.resize(heightRatio, heightRatio);
            }
            // now let's center the art on the landing zone
            var centerArt = [placedthirdBannerMast.left + (placedthirdBannerMast.width / 2), placedthirdBannerMast.top + (placedthirdBannerMast.height / 2)];
            var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
            placedthirdBannerMast.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
            // need another centered proportioning to fix it exactly in correct position
            var W = thirdBannerMast.width, H = thirdBannerMast.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
            thirdBannerMast.resize(factor, factor);
        }
        placeIconLockup1Correctly5(thirdBannerMast, { W: 456, H: 456 });
        // delete the landing zone
        landingZoneSquare.remove();
        // new purple bg
        // Add new layer above Guidelines and fill white
        var thirdMainArtworkLayer = sourceDoc.layers.getByName('Art');
        var thirdMainPurpleBgLayer = sourceDoc.layers.add();
        thirdMainPurpleBgLayer.name = "Main_Purple_BG_layer_two";
        var getthirdMainPurpleBgLayer = sourceDoc.layers.getByName('Main_Purple_BG_layer_two');
        var thirdMainRect = getthirdMainPurpleBgLayer.pathItems.rectangle(-1972, 0, 800, 500);
        var thirdMainVioletBgColor = new RGBColor();
        thirdMainVioletBgColor.red = 72;
        thirdMainVioletBgColor.green = 8;
        thirdMainVioletBgColor.blue = 111;
        thirdMainRect.filled = true;
        thirdMainRect.fillColor = thirdMainVioletBgColor;
        /*@ts-ignore*/
        getthirdMainPurpleBgLayer.move(thirdMainArtworkLayer, ElementPlacement.PLACEATEND);
        /*@ts-ignore*/
        // svgFile.embed();
        var thirdResizedRect = CSTasks.newRect(sourceDoc.artboards[2].artboardRect[0], -sourceDoc.artboards[2].artboardRect[1], 800, 500);
        sourceDoc.artboards[2].artboardRect = thirdResizedRect;
        /*********************************************************************
        RGB cropped export (JPG, PNGs at 16 and 24 sizes), squares, cropped to artwork
        **********************************************************************/
        var rgbDocCroppedVersion = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 0, DocumentColorSpace.RGB);
        rgbDocCroppedVersion.swatches.removeAll();
        var rgbGroupCropped = iconGroup.duplicate(rgbDocCroppedVersion.layers[0], 
        /*@ts-ignore*/
        ElementPlacement.PLACEATEND);
        var rgbLocCropped = [
            rgbDocCroppedVersion.artboards[0].artboardRect[0] + iconOffset[0],
            rgbDocCroppedVersion.artboards[0].artboardRect[1] + iconOffset[1],
        ];
        CSTasks.translateObjectTo(rgbGroupCropped, rgbLocCropped);
        // remove padding here befor exporting
        function placeIconLockup1Correctly(rgbGroupCropped, maxSize) {
            var W = rgbGroupCropped.width, H = rgbGroupCropped.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
            rgbGroupCropped.resize(factor, factor);
        }
        placeIconLockup1Correctly(rgbGroupCropped, { W: 256, H: 256 });
        CSTasks.ungroupOnce(rgbGroupCropped);
        // save cropped 16 and 24 sizes of PNG into the export folder
        var startWidthCropped = rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
        // Save a cropped png
        var filenameCropped1024Png = "/".concat(iconFilename, "_").concat(coreName, "_").concat(croppedName, ".png");
        var destFileCropped1024Png = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(coreName, "/").concat(pngName)) + filenameCropped1024Png);
        CSTasks.scaleAndExportPNG(rgbDocCroppedVersion, destFileCropped1024Png, startWidthCropped, exportSizes[0]);
        // Save a cropped SVG  
        var svgMasterCoreStartWidthCroppedSvg = rgbDocCroppedVersion.artboards[0].artboardRect[2] - rgbDocCroppedVersion.artboards[0].artboardRect[0];
        var filenameCroppedSvg = "/".concat(iconFilename, "_").concat(coreName, "_").concat(croppedName, ".svg");
        var destFileCroppedSvg = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(coreName, "/").concat(svgName)) + filenameCroppedSvg);
        CSTasks.scaleAndExportSVG(rgbDocCroppedVersion, destFileCroppedSvg, svgMasterCoreStartWidthCroppedSvg, exportSizes[0]);
        //close and clean up
        rgbDocCroppedVersion.close(SaveOptions.DONOTSAVECHANGES);
        rgbDocCroppedVersion = null;
        /********************
       Purple third Lockup with no text export at 800x500
       Duplication in new doc, export our assets then close the copied doc
       ********************/
        // open a new doc and copy and position the icon
        // duplication did not work as expected here. I have used a less elegant solution whereby I recreated the purple banner instead of copying it.
        var mastDocNoText800x500 = CSTasks.duplicateArtboardInNewDoc(sourceDoc, 2, DocumentColorSpace.RGB);
        mastDocNoText800x500.swatches.removeAll();
        var mastGroupNoText800x500 = iconGroup.duplicate(mastDocNoText800x500.layers[0], 
        /*@ts-ignore*/
        ElementPlacement.PLACEATEND);
        // new icon position
        var mastLocNoText800x500 = [
            mastDocNoText800x500.artboards[0].artboardRect[0],
            mastDocNoText800x500.artboards[0].artboardRect[1],
        ];
        CSTasks.translateObjectTo(mastGroupNoText800x500, mastLocNoText800x500);
        /********************************
          Custom function to create a landing square to place the icon correctly
          Some icons have width or height less than 256 so it needed special centering geometrically
          you can see the landing zone square by changing fill to true and uncommenting color
          *********************************/
        // create a landing zone square to place icon inside
        //moved it outside the function itself so we can delete it after so it doesn't get exported
        var getArtLayerInNewDocArtboard = mastDocNoText800x500.layers.getByName('Layer 1');
        var landingZoneSquareInNewDocArtboard = getArtLayerInNewDocArtboard.pathItems.rectangle(-422, 352, 456, 456);
        function placeIconLockupCorrectlyInSecondDoc(mastGroupNoText800x500, maxSize) {
            // uncomment to view landing zone
            // let setLandingZoneSquareColor = new RGBColor();
            // setLandingZoneSquareColor.red = 121;
            // setLandingZoneSquareColor.green = 128;
            // setLandingZoneSquareColor.blue = 131;
            // landingZoneSquareInFifthArtboard.fillColor = setLandingZoneSquareColor;
            landingZoneSquareInNewDocArtboard.name = "LandingZone4";
            landingZoneSquareInNewDocArtboard.filled = false;
            /*@ts-ignore*/
            landingZoneSquareInNewDocArtboard.move(getArtLayerInNewDocArtboard, ElementPlacement.PLACEATEND);
            // start moving expressive icon into our new square landing zone
            var placedmastGroup = mastGroupNoText800x500;
            var landingZone = mastDocNoText800x500.pathItems.getByName("LandingZone4");
            var preferredWidth = (456);
            var preferredHeight = (456);
            // do the width
            var widthRatio = (preferredWidth / placedmastGroup.width) * 100;
            if (placedmastGroup.width != preferredWidth) {
                placedmastGroup.resize(widthRatio, widthRatio);
            }
            // now do the height
            var heightRatio = (preferredHeight / placedmastGroup.height) * 100;
            if (placedmastGroup.height != preferredHeight) {
                placedmastGroup.resize(heightRatio, heightRatio);
            }
            // now let's center the art on the landing zone
            var centerArt = [placedmastGroup.left + (placedmastGroup.width / 2), placedmastGroup.top + (placedmastGroup.height / 2)];
            var centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
            placedmastGroup.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);
            // need another centered proportioning to fix it exactly in correct position
            var W = mastGroupNoText800x500.width, H = mastGroupNoText800x500.height, MW = maxSize.W, MH = maxSize.H, factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
            mastGroupNoText800x500.resize(factor, factor);
        }
        placeIconLockupCorrectlyInSecondDoc(mastGroupNoText800x500, { W: 456, H: 456 });
        // delete the landing zone
        landingZoneSquareInNewDocArtboard.remove();
        CSTasks.ungroupOnce(mastGroupNoText800x500);
        // add new style purple banner 4 elements
        var myMainArtworkLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('Layer 1');
        var myMainPurpleBgLayerMastDocNoText800x500 = mastDocNoText800x500.layers.add();
        myMainPurpleBgLayerMastDocNoText800x500.name = "Main_Purple_BG_layer";
        var GetMyMainPurpleBgLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('Main_Purple_BG_layer');
        var mainRectMastDocNoText800x500 = GetMyMainPurpleBgLayerMastDocNoText800x500.pathItems.rectangle(-370, 0, 800, 500);
        var setMainVioletBgColorMastDocNoText800x500 = new RGBColor();
        setMainVioletBgColorMastDocNoText800x500.red = 72;
        setMainVioletBgColorMastDocNoText800x500.green = 8;
        setMainVioletBgColorMastDocNoText800x500.blue = 111;
        mainRectMastDocNoText800x500.filled = true;
        mainRectMastDocNoText800x500.fillColor = setMainVioletBgColorMastDocNoText800x500;
        /*@ts-ignore*/
        GetMyMainPurpleBgLayerMastDocNoText800x500.move(myMainArtworkLayerMastDocNoText800x500, ElementPlacement.PLACEATEND);
        // we need to make artboard clipping mask here for the artboard to crop expressive icons correctly.
        var myCroppingLayerMastDocNoText800x500 = mastDocNoText800x500.layers.add();
        myCroppingLayerMastDocNoText800x500.name = "crop";
        var GetMyCroppingLayerMastDocNoText800x500 = mastDocNoText800x500.layers.getByName('crop');
        mastDocNoText800x500.activeLayer = GetMyCroppingLayerMastDocNoText800x500;
        mastDocNoText800x500.activeLayer.hasSelectedArtwork = true;
        // insert clipping rect here
        var mainClipRectMastDocNoText800x500 = GetMyCroppingLayerMastDocNoText800x500.pathItems.rectangle(-370, 0, 800, 500);
        // uncomment to see clipping rect
        // let setClipBgColorMastDocNoText800x500 = new RGBColor();
        // setClipBgColorMastDocNoText800x500.red = 111;
        // setClipBgColorMastDocNoText800x500.green = 111;
        // setClipBgColorMastDocNoText800x500.blue = 222;
        // mainClipRectMastDocNoText800x500.filled = true;
        // mainClipRectMastDocNoText800x500.fillColor = setClipBgColorMastDocNoText800x500;
        // select all for clipping here
        mastDocNoText800x500.selectObjectsOnActiveArtboard();
        // clip!
        app.executeMenuCommand('makeMask');
        // Exports start here:   
        var jpegStartWidth800x500 = mastDocNoText800x500.artboards[0].artboardRect[2] - mastDocNoText800x500.artboards[0].artboardRect[0];
        //save a banner PNG 
        for (var i_1 = 0; i_1 < exportSizes.length; i_1++) {
            var filename = "/".concat(iconFilename, "_Expressive_1610_1x.png");
            var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveName, "/").concat(pngName)) + filename);
            CSTasks.scaleAndExportPNG(mastDocNoText800x500, destFile, jpegStartWidth800x500, 800);
        }
        //save a banner SVG
        for (var i_2 = 0; i_2 < exportSizes.length; i_2++) {
            var filename = "/".concat(iconFilename, "_Expressive_1610.svg");
            var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveName, "/").concat(svgName)) + filename);
            CSTasks.scaleAndExportSVG(mastDocNoText800x500, destFile, jpegStartWidth800x500, 800);
        }
        //save a banner PNG @2x
        var pngStartWidth800x500_2x = mastDocNoText800x500.artboards[0].artboardRect[2] - mastDocNoText800x500.artboards[0].artboardRect[0];
        //save a banner PNG @2x
        for (var i_3 = 0; i_3 < exportSizes.length; i_3++) {
            var filename = "/".concat(iconFilename, "_Expressive_1610_2x.png");
            var destFile = new File(Folder("".concat(sourceDoc.path, "/").concat(sourceDocName, "/").concat(expressiveName, "/").concat(pngName)) + filename);
            CSTasks.scaleAndExportPNG(mastDocNoText800x500, destFile, pngStartWidth800x500_2x, 1600);
        }
        //close and clean up
        mastDocNoText800x500.close(SaveOptions.DONOTSAVECHANGES);
        mastDocNoText800x500 = null;
        //return; You can use a return to stop the code and see the effects throughout.
        // happy vector coding!
        // ends here
        // Save
        //app.activeDocument.saveAs(file, SaveOptions_ai())
        // Close
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    };
    var file, sourceDoc;
    for (i = 0; i < files.length; i++) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    // For better or for worse...
    alert("Script is done.");
}
function SaveOptions_ai() {
    var saveOptions = new IllustratorSaveOptions();
    // saveOptions.compatibility = Compatibility["ILLUSTRATOR" + targetVersion];
    /*@ts-ignore*/
    saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
    /*@ts-ignore*/
    saveOptions.compressed = false; // Version 10 or later
    /*@ts-ignore*/
    saveOptions.pdfCompatible = true; // Version 10 or later
    /*@ts-ignore*/
    saveOptions.embedICCProfile = true; // Version 9 or later
    /*@ts-ignore*/
    saveOptions.embedLinkedFiles = true; // Version 7 or later
    return saveOptions;
}
function GetFiles(folder) {
    var i, item, 
    // Array to store the files in...
    files = [], 
    // Get files...
    items = folder.getFiles();
    // Loop through all files in the given folder
    for (i = 0; i < items.length; i++) {
        item = items[i];
        // Find .ai files
        var fileformat = item.name.match(/\.ai$/i), legacyFile = item.name.indexOf("(legacyFile)") > 0;
        // If item is a folder, check the folder for files.
        if (item instanceof Folder) {
            // Combine existing array with files found in the folder
            files = files.concat(GetFiles(item));
        }
        // If the item is a file, push it to the array.
        else if (item instanceof File && fileformat && !legacyFile) {
            // Push files to the array
            files.push(item);
        }
    }
    return files;
}
