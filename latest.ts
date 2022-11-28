alert(" \n\nThis script only works locally not on a server. \n\nDon't forget to change .txt to .js on the script. \n\nFULL README: https://github.com/Artchibald/batch-800-500-illustrator-export   \n\n  This script relates to this other script: https://github.com/Artchibald/2022_icon_rebrand_scripts. It is an addon built on top to run a batch export of the 800x500 no text. \n\nVideo set up tutorial available here: https://youtu.be/XXXXXXXXXXXXXX. \n\nOpen Illustrator but don't open a document. \n\nGo to file > Scripts > Other Scripts > Import our new script. \n\n Illustrator says(not responding) on PC but it will respond, give Bill Gates some time XD!). \n\nIf you run the script again, you should probably delete the previous assets created.They get intermixed and overwritten. \n\nBoth artboard sizes of 1 and 2 must be exactly 256px x 256px. \n\nGuides must be on a layer called exactly 'Guidelines'. \n\nIcons must be on a layer called exactly 'Art'. \n\nMake sure all layers are unlocked to avoid bugs. \n\nExported assets will be saved where the.ai file is saved. \n\nPlease try to use underscore instead of spaces to avoid bugs in filenames. \n\nMake sure you are using the correct swatches / colours. \n\nIllustrator check advanced colour mode is correct: Edit > Assign profile > Must match sRGB IEC61966 - 2.1. \n\nSelect each individual color shape and under Window > Colours make sure each shape colour is set to rgb in tiny top right burger menu if bugs encountered. \n\nIf it does not save exports as intended, check the file permissions of where the.ai file is saved(right click folder > Properties > Visibility > Read and write access ? Also you can try apply permissions to sub folders too if you find that option) \n\nAny issues: archie ATsymbol archibaldbutler.com.");


// function my_script() {
//  // copy a full text of your script here
//  // or include the jsx file this way:
//  //# include '~/Desktop/script/my_script.jsx'
//  alert("custom script executed");
// }

// function main() {
//  var folder = Folder.selectDialog('Please, select the folder');
//  if (!(folder instanceof Folder)) return;
//  var files = folder.getFiles('*.ai');
//  if (files.length == 0) {
//   alert('Folder doesn\'t content AI files');
//   return;
//  }
//  var i = files.length;
//  while (i--) {
//   var doc = app.open(files[i]);
//   my_script();             // <------- here your script is running
//   doc.save();
//   doc.close();
//  }

//  alert(files.length + ' files were processed');
// }

// main();




// https://gist.github.com/joonaspaakko/df2f9e31bdb365a6e5df
// Finds all .ai files from the input folder + its subfolders and converts them to the version given below in a variable called "targetVersion"
// Tested in Illustrator cc 2014 (Mac)
// Didn't bother to do a speed test with my macbook air...
// If set to false, a new file will be written next to the original file.
// The new file will have (legacyFile) in the name.
// Files with (legacyFile) in the file name are always ignored.
var overwrite = true, // boolean
 // Accepted values:
 // 8, 9, 10, 11 (cs), 12 (cs2), 13 (cs3), 14 (cs4), 15 (cs5), 16 (cs6), 17 (cc)
 targetVersion = 13;

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
  file = !overwrite ? new File(file.toString().replace(".ai", " (legacyFile).ai")) : file;

  // Save
  app.activeDocument.saveAs(file, SaveOptions_ai())

  // Close
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

 }

 // For better of for worse...
 alert("Script is done.");

}

function SaveOptions_ai() {

 var saveOptions = new IllustratorSaveOptions();

 // saveOptions.compatibility = Compatibility["ILLUSTRATOR" + targetVersion];
 saveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
 saveOptions.compressed = false; // Version 10 or later
 saveOptions.pdfCompatible = true; // Version 10 or later
 saveOptions.embedICCProfile = true; // Version 9 or later
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