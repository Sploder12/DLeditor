import * as struct from "./structure.js"
import * as graphic from "./graphic.js"

export const idInput = document.getElementById("editorNodeID");
export const titleInput = document.getElementById("editorNodeTitle");
export const descInput = document.getElementById("editorNodeDesc");
export const nodeType = document.getElementById("editorNodeType");

export class instance {
    constructor() {
        this.game = new struct.Game();
        this.updated = false;
        this.fileName = "untitled.dl";
        this.selectedNode = null;
        this.viewX = -320.0;
        this.viewY = -240.0;
        this.zoom = 1.0;

        this.connecting = false;
        this.connectingType = "";
    }

    selectNode(node) {
        if (this.connecting && this.selectedNode !== null) {
            if (this.connectingType === "") {
                this.selectedNode.remove_connection(node);
            } else {
                this.selectedNode.add_connection(node, this.connectingType);
            }
            this.connecting = false;
            this.updated = true;
            this.selectedNode = null;
            graphic.draw(this);
            return;
        }

        this.selectedNode = node;
        if (!this.connecting) {
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
        this.selectedNode = null;

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
        this.connecting = false;
        this.updated = true;
        let node = new struct.Node(this.game.nodes.length + "", "", "", "node", this.view_x + 320, this.view_y + 240)
        this.game.add_node(node);
        this.selectNode(node);
        graphic.draw(this);
    }

    deleteNode() {
        this.connecting = false;

        if (this.selectedNode !== null) {
            for (var i = 0; i < this.game.nodes.length; ++i) {
                if (this.game.nodes[i] === this.selectedNode) {
                    this.game.nodes.splice(i, 1);
                    break;
                }
            }
    
            for (let node of this.game.nodes) {
                node.remove_connection(this.selectedNode);
            }
            this.clearNode();
            this.updated = true;
            graphic.draw(this);
        }
    }

    select(x, y) {
        for (let i = this.game.nodes.length - 1; i >= 0; --i) {
            let node = this.game.nodes[i];
            
            const metrics = graphic.context.measureText(node.id);
            const width = metrics.width;
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            if (node.inside(x + this.view_x, y + this.view_y, width, height, graphic.PADDING)) {
                this.selectNode(node);
                if (this.selectedNode !== null && !this.connecting) {
                    this.selectedNode.move(x + this.view_x, y + this.view_y);
                    graphic.draw(this);
                }
                return;
            }
        }
    }
}