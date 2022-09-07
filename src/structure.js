
export const BasicConnection = "->"
export const BreakingConnection = "\->"

export const NodeTypes = [
    "starting",
    "node",
    "location",
    "fight",
    "run"
]

export class Connection {
    constructor(to, from, type) {
        this.to = to;
        this.from = from;
        this.type = type;
    }
}

export class Node {
    constructor(id, title, description, type, x, y) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.connections = [];
        this.x = x;
        this.y = y;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    inside(x, y, width, height, padding) {
        width = width + padding * 2;
        height = height + padding * 2;
        const left = this.x - width/2 - padding;
        const top = this.y - height/2 - padding;

        if (x >= left && y >= top) {
            if (x <= left + width + padding * 2 && y <= top + width + padding * 2) {
                return true;
            }
        }
        return false;
    }

    add_connection(to, type) {
        if (type === BasicConnection || type === BreakingConnection) {
            this.connections.push(new Connection(this, to, type));
        }
    }
}

export class Game {
    constructor() {
        this.nodes = [];
    }

    add_node(node) {
        this.nodes.push(node);
    }
}