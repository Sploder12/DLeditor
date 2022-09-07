import * as struct from "./structure.js"


function error(reason) {
    alert(reason);
    console.log(reason);
}

const c_funcs = {
    "->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection); },
    "\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection); },
    "<->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection);
                                     node_b.add_connection(node, struct.BasicConnection);},

    "<-\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection);
                                       node_b.add_connection(node, struct.BasicConnection); },

    "<-/->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection);
                                       node_b.add_connection(node, struct.BreakingConnection); },
    
    "<-/\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection);
                                        node_b.add_connection(node, struct.BreakingConnection); },
}

export function parse(content) {
    
    content = content.replace(/(\r\n|\n|\r)/gm, '\n'); // thanks again JS
    const sections = content.split("\n---\n");
    if (sections.length != 2) {
        error("Invalid .dl format.");
        return new struct.Game();
    }

    const nodes = sections[0];
    const connections = sections[1];

    let node_map = {};

    for (const node in nodes.split('\n')) {
        const data = node.match(/\s*\|\s*/);

        if (data === null || data.length != 4) {
            error("Invalid node format.");
            return new struct.Game();
        }

        const id = data[0];
        const type = data[1];
        const name = data[2];
        const desc = data[3];

        if (!(type in struct.NodeTypes)) {
            error("Invalid node type " + type);
            return new struct.Game();
        }
        
        node_map[id] = new struct.Node(name, desc, type, 0.0, 0.0);
    }
    
    for (connection in connections.strip('\n').split('\n')) {
        const data = connection.match(/^(\d*)\s*([^\s]*)\s*(\d*)\s*$/);

        if (data === null || data.length != 3) {
            error("Invalid connection format.");
            return new struct.Game();
        }

        if (!(Object.hasOwn(c_funcs, data[1]))) {
            error("Invalid connection type " + data[1]);
            return new struct.Game();
        }

        let node_a = node_map[data[0]];
        let node_b = node_map[data[2]];

        c_funcs[data[1]](node_a, node_b);
    }


    let out = new struct.Game();
    for (const [id, node] of Object.entries(node_map)) {
        out.add_node(node);
    }
    return out;
}
