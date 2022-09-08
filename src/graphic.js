import * as struct from "./structure.js"

export const canvas = document.getElementById("editor");
export let context = canvas.getContext("2d");

export const PADDING = 10;

export function draw(instance) {
    context.font = "30px Arial";
    context.textAlign = "center";
    context.lineWidth = 2;
    context.fillStyle = "#ffffff";
    context.setLineDash([]);
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);

    // draw connections
    for (let node of instance.game.nodes) {
        for (let connection of node.connections) {
            if (connection.type === struct.BreakingConnection) {
                context.setLineDash([5, 5]);
            } else {
                context.setLineDash([]);
            }

            let grd = context.createLinearGradient(node.x - instance.view_x, node.y - instance.view_y - PADDING, connection.to.x - instance.view_x, connection.to.y - instance.view_y - PADDING);
            grd.addColorStop(0, "rgba(0,0,0,1.0)");
            grd.addColorStop(1, "rgba(255,255,255,0.0)");
            context.strokeStyle = grd;

            context.beginPath();
            context.moveTo(node.x - instance.view_x, node.y - instance.view_y - PADDING);
            context.lineTo(connection.to.x - instance.view_x, connection.to.y - instance.view_y - PADDING);
            context.stroke();
        }
    }
    context.setLineDash([]);
    context.strokeStyle = "#000000";

    // draw boxes
    for (let node of instance.game.nodes) {
        const metrics = context.measureText(node.id);
        let width = metrics.width;
        let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        width += PADDING * 2;
        height += PADDING * 2;

        let x = node.x - (width / 2);
        let y = node.y - (height / 2) - PADDING;
        
        if (node.type === "starting") {
            context.fillStyle = "#80e080";
        } else if(node.type === "location") { 
            context.fillStyle = "#b0b080";
        } else if(node.type === "fight") { 
            context.fillStyle = "#e08080";
        } else if(node.type === "run") { 
            context.fillStyle = "#8080b0";
        } else {
            context.fillStyle = "#808080";
        }

        context.fillRect(x - instance.view_x, y - instance.view_y, width, height);
        context.fillStyle = "#f0f0f0";
        context.strokeRect(x - instance.view_x, y - instance.view_y, width, height);
        context.fillStyle = "#000000";
        context.fillText(node.id, node.x - instance.view_x, node.y - instance.view_y);
    }
}