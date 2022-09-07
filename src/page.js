import * as struct from "./structure.js"
import * as parser from "./parser.js"

let updated = false;
let fileName = "untitled.dl";

let game = new struct.Game();

const padding = 10;

// redraws the canvas and updates updated
function commitChange() {
    const canvas = document.getElementById("editor");
    let context = canvas.getContext("2d");

    context.fillStyle = "#808080";
    context.font = "30px Arial";
    context.textAlign = "center";

    

    for (node of game.nodes) {
        const width = context.measureText(node.title).width;
        const height = context.measureText(node.title).height;

        context.fillRect(node.x - (width / 2) - padding, node.y - (height/2) - padding, width + padding * 2, height + padding * 2);
        context.fillText(node.x, node.y);
    }
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
    input.accept= ".dl";
    
    input.onchange = function() {
        let files = Array.from(input.files);
        if (files.length >= 1) {
            let file = files[0];

            fileName = file.name;

            // load .dl
            const reader = new FileReader();
            
            reader.onerror = function() {
                alert("Could not read file " + file.name);
                console.log(reader.error);
            };

            reader.onload = function() {
                game = parser.parse(reader.result);
                updated = false;
                commitChange();
            }

            reader.readAsText(file);
        }
    };
    input.click();
}

function fileSave() {
    
}

document.querySelector("#FileNew").addEventListener("click", fileNew);
document.querySelector("#FileOpen").addEventListener("click", fileOpen);
document.querySelector("#FileSave").addEventListener("click", fileSave);