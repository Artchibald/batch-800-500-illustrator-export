# batch-800-500-illustrator-export

Run this script on a batch of ai files in a folder containing the new icon exports.

This script only works once you have run this script on each icon individually;

https://github.com/Artchibald/2022_icon_rebrand_scripts

It prompts the user to select a folder where all the previous icon exports are saved, then the script loops through all the .ai files contained with the root and the subfolders also, for each iteration:

- Opens the ai file

- Creates necessary artboards, rectangles, copies icon across, identifies the position of the icon landing zone, pastes it inside.

- It exports the artboard asset as SVG and 2 PNG (1@1x, 1@2x) for the 800x500 icon with no text. So 3 exports altogether.

- Lastly it closes each .ai file before opening the next using the loop.

Happy vector coding!

Any issues archie ATSymbol archibaldbutler.com.