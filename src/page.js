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
    context.lineWidth = 2;
    context.fillStyle = "#ffffff";
    context.setLineDash([]);
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);

    // draw connections
    for (let node of game.nodes) {
        for (let connection of node.connections) {
            if (connection.type === struct.BreakingConnection) {
                context.setLineDash([5, 10]);
            } else {
                context.setLineDash([]);
            }

            let grd = context.createLinearGradient(node.x - view_x, node.y - view_y, connection.to.x - view_x, connection.to.y - view_y);
            grd.addColorStop(0, "rgba(0,0,0,1.0)");
            grd.addColorStop(1, "rgba(255,255,255,0.0)");
            context.strokeStyle = grd;

            context.beginPath();
            context.moveTo(node.x - view_x, node.y - view_y - padding);
            context.lineTo(connection.to.x - view_x, connection.to.y - view_y - padding);
            context.stroke();
        }
    }
    context.strokeStyle = "#000000";

    // draw boxes
    for (let node of game.nodes) {
        const metrics = context.measureText(node.id);
        let width = metrics.width;
        let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        width = width + padding * 2;
        height = height + padding * 2;

        let x = node.x - (width / 2);
        let y = node.y - (height / 2) - padding;
        context.fillStyle = "#808080";
        context.fillRect(x - view_x, y - view_y, width, height);
        context.fillStyle = "#f0f0f0";
        context.strokeRect(x - view_x, y - view_y, width, height);
        context.fillStyle = "#000000";
        context.fillText(node.id, node.x - view_x, node.y - view_y);
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
    const rect = canvas.getBoundingClientRect();
    prevX = e.offsetX / (rect.width / 640.0);
    prevY = e.offsetY / (rect.height / 480.0);

    if (e.button == 0) {
        selectedNode = null;

        dragging = true;
        panning = false;

        for (let i = game.nodes.length - 1; i >= 0; i -= 1) {
            let node = game.nodes[i];
            
            const metrics = context.measureText(node.id);
            const width = metrics.width;
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            if (node.inside(prevX + view_x, prevY + view_y, width, height, padding)) {
                selectedNode = node;
                selectedNode.x = prevX + view_x;
                selectedNode.y = prevY + view_y;
                commitChange();
                break;
            }
        }

    } else if (e.button == 2) {
        panning = true;
        dragging = false;
    }
}


function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const realX = e.offsetX / (rect.width / 640.0);
    const realY = e.offsetY / (rect.height / 480.0);

    if (dragging && selectedNode !== null) {
        selectedNode.x = realX + view_x;
        selectedNode.y = realY + view_y;
        commitChange();
    } else if (panning) {
        view_x -= (realX - prevX);
        view_y -= (realY - prevY);
        commitChange();
    }

    prevX = realX;
    prevY = realY;
}

function mouseLeave(e) {
    panning = false;
}

canvas.oncontextmenu = function(e) { return false; };
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseleave", mouseLeave);

function fileNew() {
    if (updated) {
        if (!confirm("You have unsaved changes.\nContinue?")) {
            return;
        } 
        updated = false;
    }

    view_x = -400.0;
    view_y = -320.0;
    selectedNode = null;
    game = new struct.Game();
    commitChange();

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
                view_x = -400.0;
                view_y = -320.0;
                updated = false;
                commitChange();
            }

            reader.readAsText(file);
        }
    };
    input.click();
}

function fileSave() {
    var saveData = "";
    for (let node of game.nodes) {
        saveData += node.id + " | " + node.type + " | " + node.title + " | " + node.description + '\n';
    }

    saveData += "---\n";

    for (let node of game.nodes) {
        for (let connection of node.connections) {
            saveData += connection.from.id + ' ' + connection.type + ' ' + connection.to.id + '\n';
        }
    }

    // thanks StackOverflow
    let file = new Blob([saveData], {type: "text/plain"});

    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fileName);
    else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

document.querySelector("#FileNew").addEventListener("click", fileNew);
document.querySelector("#FileOpen").addEventListener("click", fileOpen);
document.querySelector("#FileSave").addEventListener("click", fileSave);