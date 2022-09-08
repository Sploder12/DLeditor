import * as struct from "./structure.js"
import * as parser from "./parser.js"
import * as editor from "./editor.js"
import * as graphic from "./graphic.js"

let active = new editor.instance();
let tabs = [active];


editor.idInput.onchange = function() {
    if (active.selectedNode !== null) {
        if (editor.idInput.value !== active.selectedNode.id) {
            active.selectedNode.id = editor.idInput.value;
            active.updated = true;
            graphic.draw(active);
        }
    }
}

editor.titleInput.onchange = function() {
    if (active.selectedNode !== null) {
        if (editor.titleInput.value !== active.selectedNode.title) {
            active.selectedNode.title = editor.titleInput.value;
            active.updated = true;
        }
    }
}

editor.descInput.onchange = function() {
    if (active.selectedNode !== null) {
        if (editor.descInput.value !== active.selectedNode.description) {
            active.selectedNode.description = editor.descInput.value;
            active.updated = true;
        }
    }
}

editor.nodeType.onchange = function() {
    if (active.selectedNode !== null) {
        if (editor.nodeType.value !== active.selectedNode.title) {
            active.selectedNode.type = editor.nodeType.value;
            active.updated = true;
            graphic.draw(active);
        }
    }
}

let dragging = false;
let panning = false;

function addNode() {
    active.newNode();
}

function deleteNode() {
    active.deleteNode();
}


function addBasicConnection() {
    active.clearNode();
    active.connecting = true;
    active.connectingType = struct.BasicConnection;
    graphic.draw(active);
}

function addBreakingConnection() {
    active.clearNode();
    active.connecting = true;
    active.connectingType = struct.BreakingConnection;
    graphic.draw(active);
}

function removeConnection() {
    active.clearNode();
    active.connecting = true;
    active.connectingType = "";
    graphic.draw(active);
}

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
    const rect = graphic.canvas.getBoundingClientRect();
    prevX = e.offsetX * (640.0 / rect.width);
    prevY = e.offsetY * (480.0 / rect.height);

    if (e.button == 0) {
        active.clearNode();

        dragging = true;
        panning = false;

        active.select(prevX, prevY);

    } else if (e.button == 2) {
        panning = true;
        dragging = false;
    }
}


function mouseMove(e) {
    const rect = graphic.canvas.getBoundingClientRect();
    const realX = e.offsetX * (640.0 / rect.width);
    const realY = e.offsetY * (480.0 / rect.height);

    if (dragging && active.selectedNode !== null) {
        active.selectedNode.move(realX + active.viewX, realY + active.viewY);
        graphic.draw(active);
    } else if (panning) {
        active.viewX -= (realX - prevX);
        active.viewY -= (realY - prevY);
        graphic.draw(active);
    }

    prevX = realX;
    prevY = realY;
}

function mouseLeave(e) {
    panning = false;
}

graphic.canvas.oncontextmenu = function(e) { return false; };
graphic.canvas.addEventListener("mouseup", mouseUp);
graphic.canvas.addEventListener("mousedown", mouseDown);
graphic.canvas.addEventListener("mousemove", mouseMove);
graphic.canvas.addEventListener("mouseleave", mouseLeave);

function fileNew() {
    if (active.updated) {
        if (!confirm("You have unsaved changes.\nContinue?")) {
            return;
        } 
        active.updated = false;
    }

    viewX = -400.0;
    viewY = -320.0;
    active = new editor.instance();
    graphic.draw(active)
}

function fileOpen() {
   
    if (active.updated) {
        if (!confirm("You have unsaved changes.\nContinue?")) {
            return;
        } 
        active.updated = false;
    }

    let input = document.createElement("input");
    input.type = "file";
    input.accept= ".dl";
    
    input.onchange = function() {
        let files = Array.from(input.files);
        if (files.length >= 1) {
            let file = files[0];

            active.fileName = file.name;

            // load .dl
            const reader = new FileReader();
            
            reader.onerror = function() {
                alert("Could not read file " + file.name);
                console.log(reader.error);
            };

            reader.onload = function() {
                active.game = parser.parse(reader.result);
                active.viewX = -400.0;
                active.viewY = -320.0;
                active.updated = false;
                graphic.draw(active);
            }

            reader.readAsText(file);
        }
    };
    input.click();
}

function fileSave() {
    var saveData = "";
    for (let node of active.game.nodes) {
        saveData += node.id + " | " + node.type + " | " + node.title + " | " + node.description + '\n';
    }

    saveData += "---\n";

    for (let node of active.game.nodes) {
        for (let connection of node.connections) {
            saveData += connection.from.id + ' ' + connection.type + ' ' + connection.to.id + '\n';
        }
    }

    // thanks StackOverflow
    let file = new Blob([saveData], {type: "text/plain"});

    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, active.fileName);
    else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = active.fileName;
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

document.getElementById("AddNode").addEventListener("click", addNode);
document.getElementById("DeleteNode").addEventListener("click", deleteNode);
document.getElementById("AddConnection->").addEventListener("click", addBasicConnection);
document.getElementById("AddConnection\\->").addEventListener("click", addBreakingConnection);
document.getElementById("RemoveConnection").addEventListener("click", removeConnection);