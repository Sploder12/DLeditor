
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
    constructor(title, description, type, x, y) {
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