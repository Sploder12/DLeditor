import * as struct from "./structure.js"
import * as parser from "./parser.js"

let updated = false;
let fileName = "untitled.dl";

let game = new struct.Game();

// redraws the canvas and updates updated
function commitChange() {
    
}

function fileNew() {
    if (updated) {
        if (!confirm("You have unsaved changes.\nContinue?")) {
            return;
        } 
        updated = false;
    }


}

function fileOpen() {
   
    if (updated) {
        if (!confirm("You have unsaved changes.\nContinue?")) {
            return;
        } 
        updated = false;
    }

    let input = document.createElement("input");
    input.type = "file";
    input.accept=".dl";
    input.click();

    let files = Array.from(input.files);
    if (files.length >= 1) {
        let file = files[0];

        fileName = file.name;

        // load .dl
        const reader = new FileReader();
       
        reader.onload = fileLoad;
        
        reader.onerror = function() {
            alert("Could not read file " + file.name);
            console.log(reader.error);
        };

        reader.onload = function() {
            game = parser.parse(reader.result);
        }

        reader.readAsText(file);
    } 
}

function fileSave() {
    
}

document.querySelector("#FileNew").addEventListener("click", fileNew);
document.querySelector("#FileOpen").addEventListener("click", fileOpen);
document.querySelector("#FileSave").addEventListener("click", fileSave);