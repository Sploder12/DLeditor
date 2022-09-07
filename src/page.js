import * as struct from "./structure.js"
import * as parser from "./parser.js"

let updated = false;
let fileName = "untitled.dl";

let game = new struct.Game();
let selectedNode = null;

const padding = 10;

let view_x = -400.0;
let view_y = -320.0;
let zoom = 1.0;

const canvas = document.getElementById("editor");
let context = canvas.getContext("2d");

// redraws the canvas and updates updated
function commitChange() {
    
    context.font = "30px Arial";
    context.textAlign = "center";    

    for (let node of game.nodes) {
        const width = context.measureText(node.title).width;
        const height = context.measureText(node.title).height;

        let x = node.x - (width / 2) - padding;
        let y = node.y - (height / 2) - padding;
        context.fillStyle = "#808080";
        context.fillRect(x - view_x, y - view_y, width + padding * 2, height + padding * 2);
        context.fillStyle = "#000000";
        context.fillText(node.title, node.x - view_x, node.y - view_y);
    }
}

let dragging = false;
let panning = false;

function mouseUp(e) {
    if (e.button == 0) {
        dragging = false;
    } else if (e.button == 2) {
        panning = false;
    }
}

let prevX = 0.0;
let prevY = 0.0;
function mouseDown(e) {
    prevX = e.clientX;
    prevY = e.clientY;

    if (e.button == 0) {
        dragging = true;
        panning = false;
    } else if (e.button == 2) {
        panning = true;
        dragging = false;
    }
}


function mouseMove(e) {
    if (dragging) {

    } else if (panning) {
        view_x += (e.clientX - prevX);
        view_y += (e.clientY - prevY);
    }

    prevX = e.clientX;
    prevY = e.clientY;
}

canvas.oncontextmenu = function(e) { return false; };
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);

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