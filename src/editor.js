import * as struct from "./structure.js"
import * as graphic from "./graphic.js"

export const idInput = document.getElementById("editorNodeID");
export const titleInput = document.getElementById("editorNodeTitle");
export const descInput = document.getElementById("editorNodeDesc");
export const nodeType = document.getElementById("editorNodeType");

export class instance {
    constructor() {
        self.game = new struct.Game();
        self.updated = false;
        self.fileName = "untitled.dl";
        self.selectedNode = null;
        self.viewX = -320.0;
        self.viewY = -240.0;
        self.zoom = 1.0;

        self.connecting = false;
        self.connectingType = "";
    }

    selectNode(node) {
        if (self.connecting && self.selectedNode !== null) {
            if (self.connectingType === "") {
                self.selectedNode.remove_connection(node);
            } else {
                self.selectedNode.add_connection(node, self.connectingType);
            }
            self.connecting = false;
            self.updated = true;
            self.selectedNode = null;
            graphic.draw(self);
            return;
        }

        self.selectedNode = node;
        if (!self.connecting) {
            idInput.value = node.id;
            titleInput.value = node.title;
            descInput.value = node.description;
            nodeType.value = node.type;

            idInput.disabled = false;
            titleInput.disabled = false;
            descInput.disabled = false;
            nodeType.disabled = false;
        }
    }

    clearNode() {
        self.selectedNode = null;

        idInput.disabled = true;
        titleInput.disabled = true;
        descInput.disabled = true;
        nodeType.disabled = true;

        idInput.value = "";
        titleInput.value = "";
        descInput.value = "";
        nodeType.value = "";
    }

    newNode() {
        self.connecting = false;
        self.updated = true;
        let node = new struct.Node(self.game.nodes.length + "", "", "", "node", self.view_x + 320, self.view_y + 240)
        self.game.add_node(node);
        self.selectNode(node);
        graphic.draw(self);
    }

    deleteNode() {
        self.connecting = false;

        if (self.selectedNode !== null) {
            for (var i = 0; i < self.game.nodes.length; ++i) {
                if (self.game.nodes[i] === self.selectedNode) {
                    self.game.nodes.splice(i, 1);
                    break;
                }
            }
    
            for (let node of self.game.nodes) {
                node.remove_connection(self.selectedNode);
            }
            self.clearNode();
            self.updated = true;
            graphic.draw(self);
        }
    }

    select(x, y) {
        for (let i = self.game.nodes.length - 1; i >= 0; --i) {
            let node = self.game.nodes[i];
            
            const metrics = graphic.context.measureText(node.id);
            const width = metrics.width;
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            if (node.inside(x + self.view_x, y + self.view_y, width, height, graphic.PADDING)) {
                self.selectNode(node);
                if (self.selectedNode !== null && !self.connecting) {
                    self.selectedNode.move(x + self.view_x, y + self.view_y);
                    graphic.draw(self);
                }
                return;
            }
        }
    }
}