alert(" \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/batch-800-500-illustrator-export   \n\n  This script relates to this other script: https://github.com/Artchibald/2022_icon_rebrand_scripts. It is an addon built on top to run a batch export of the 800x500 no text. \n\nVideo set up tutorial available here: https://youtu.be/XXXXXXXXXXXXXX. \n\nOpen Illustrator but don't open a document. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Illustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes of 1 and 2 must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease try to use underscore instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");

let i;

let CSTasks = (function () {
 var tasks: any = {};
 tasks.newRect = function (x, y, width, height) {
  let rect = [];
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
  let newGroup = sourceDoc.groupItems.add();
  for (i = 0; i < collection.length; i++) {
   collection[i].moveToBeginning(newGroup);
  }
  return newGroup;
 };

 tasks.getArtboardCorner = function (artboard) {
  let corner = [artboard.artboardRect[0], artboard.artboardRect[1]];
  return corner;
 };

 //takes an array [x,y] for an item's position and an array [x,y] for the position of a reference point
 //returns an array [x,y] for the offset between the two points
 tasks.getOffset = function (itemPos, referencePos) {
  let offset = [itemPos[0] - referencePos[0], itemPos[1] - referencePos[1]];
  return offset;
 };

 //takes an object (e.g. group) and a destination array [x,y]
 //moves the group to the specified destination
 tasks.translateObjectTo = function (object, destination) {
  let offset = tasks.getOffset(object.position, destination);
  object.translate(-offset[0], -offset[1]);
 };


 return tasks;

})();


// https://gist.github.com/joonaspaakko/df2f9e31bdb365a6e5df
// Finds all .ai files from the input folder + its subfolders 
// Tested in Illustrator cc 2014 (Mac)
// If set to false, a new file will be written next to the original file.
// The new file will have (legacyFile) in the name.
// Files with (legacyFile) in the file name are always ignored.
var overwrite = true // boolean
if (app.documents.length > 0) {
 alert("ERROR: \n Close all documents before running this script.");
}
// Run the script
else {
 var files,
  folder = Folder.selectDialog("Input folder...");
 // If folder variable return null, user most likely canceled the dialog or
 // the input folder and it subfolders don't contain any .ai files.
 if (folder != null) {
  // returns an array of file paths in the selected folder.
  files = GetFiles(folder);
  // This is where things actually start happening...
  process(files);
 }
}

function process(files) {
 // Loop through the list of .ai files:
 // Open > Save > Close > LOOP
 var i;
 for (i = 0; i < files.length; i++) {
  // Current file
  var file = files[i]

  // Open
  app.open(file);
  // If overwrite is false, create a new file, otherwise use "file" variable;
  //  file = !overwrite ? new File(file.toString().replace(".ai", " (legacyFile).ai")) : file;





  // starts here
  var sourceDoc = app.activeDocument;
  //alert(sourceDoc.name);

  // create 800x500 artboard in file
  let FifthMainArtboardFirstRect = sourceDoc.artboards[1].artboardRect;
  sourceDoc.artboards.add(
   // this fires but then gets replaced further down
   CSTasks.newRect(FifthMainArtboardFirstRect[1], 370, 800, 500)
  );

  //select the contents on artboard 1
  let selFifthBanner = CSTasks.selectContentsOnArtboard(sourceDoc, 1);

  // make sure all colors are RGB, equivalent of Edit > Colors > Convert to RGB
  app.executeMenuCommand('Colors9');

  if (selFifthBanner.length == 0) {
   //if nothing is in the artboard
   alert("Please try again with artwork on the main second 256x256 artboard.");
   return;
  }

  /********************************
  Add elements to new fourth artboard with lockup
  *********************************/
  let iconGroup = CSTasks.createGroup(sourceDoc, selFifthBanner); //group the selection (easier to work with)
  let iconOffset = CSTasks.getOffset(
   iconGroup.position,
   CSTasks.getArtboardCorner(sourceDoc.artboards[1])
  );


  //place icon on lockup
  /*@ts-ignore*/
  let fourthBannerMast = iconGroup.duplicate(iconGroup.layer, ElementPlacement.PLACEATEND);
  let fourthBannerMastPos = [
   sourceDoc.artboards[2].artboardRect[0] + iconOffset[0],
   sourceDoc.artboards[2].artboardRect[1] + iconOffset[1],
  ];
  CSTasks.translateObjectTo(fourthBannerMast, fourthBannerMastPos);

  let getArtLayer5 = sourceDoc.layers.getByName('Art');
  let landingZoneSquare5 = getArtLayer5.pathItems.rectangle(
   -2024,
   352,
   456,
   456);

  function placeIconLockup1Correctly5(fourthBannerMast, maxSize) {
   // let setLandingZoneSquareColor = new RGBColor();
   // setLandingZoneSquareColor.red = 121;
   // setLandingZoneSquareColor.green = 128;
   // setLandingZoneSquareColor.blue = 131;
   // landingZoneSquare5.fillColor = setLandingZoneSquareColor;
   landingZoneSquare5.name = "LandingZone2"
   landingZoneSquare5.filled = false;
   /*@ts-ignore*/
   landingZoneSquare5.move(getArtLayer5, ElementPlacement.PLACEATEND);

   // start moving expressive icon into our new square landing zone
   let placedfourthBannerMast = fourthBannerMast;
   let landingZone = sourceDoc.pathItems.getByName("LandingZone2");
   let preferredWidth = (456);
   let preferredHeight = (456);
   // do the width
   let widthRatio = (preferredWidth / placedfourthBannerMast.width) * 100;
   if (placedfourthBannerMast.width != preferredWidth) {
    placedfourthBannerMast.resize(widthRatio, widthRatio);
   }
   // now do the height
   let heightRatio = (preferredHeight / placedfourthBannerMast.height) * 100;
   if (placedfourthBannerMast.height != preferredHeight) {
    placedfourthBannerMast.resize(heightRatio, heightRatio);
   }
   // now let's center the art on the landing zone
   let centerArt = [placedfourthBannerMast.left + (placedfourthBannerMast.width / 2), placedfourthBannerMast.top + (placedfourthBannerMast.height / 2)];
   let centerLz = [landingZone.left + (landingZone.width / 2), landingZone.top + (landingZone.height / 2)];
   placedfourthBannerMast.translate(centerLz[0] - centerArt[0], centerLz[1] - centerArt[1]);

   // need another centered proportioning to fix it exactly in correct position
   let W = fourthBannerMast.width,
    H = fourthBannerMast.height,
    MW = maxSize.W,
    MH = maxSize.H,
    factor = W / H > MW / MH ? MW / W * 100 : MH / H * 100;
   fourthBannerMast.resize(factor, factor);
  }
  placeIconLockup1Correctly5(fourthBannerMast, { W: 456, H: 456 });

  // delete the landing zone
  landingZoneSquare5.remove();

  return;
  // ends here
















  // Save
  app.activeDocument.saveAs(file, SaveOptions_ai())
  // Close
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
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
 return saveOptions
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
  var fileformat = item.name.match(/\.ai$/i),
   legacyFile = item.name.indexOf("(legacyFile)") > 0;
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