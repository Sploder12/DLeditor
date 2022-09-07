import * as struct from "./structure.js"


function error(reason) {
    alert(reason);
    console.log(reason);
}

const c_funcs = {
    "->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection); },
    "\\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection); },
    "<->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection);
                                     node_b.add_connection(node, struct.BasicConnection);},

    "<-\\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection);
                                       node_b.add_connection(node, struct.BasicConnection); },

    "<-/->": function (node, node_b) { node.add_connection(node_b, struct.BasicConnection);
                                       node_b.add_connection(node, struct.BreakingConnection); },
    
    "<-/\\->": function (node, node_b) { node.add_connection(node_b, struct.BreakingConnection);
                                        node_b.add_connection(node, struct.BreakingConnection); },
}

export function parse(content) {
    
    content = content.replace(/\r|(\r\n)/g, '\n').replace(/\n+/g, '\n'); // thanks again JS
    const sections = content.split("\n---\n");
    if (sections.length != 2) {
        error("Invalid .dl format.");
        return new struct.Game();
    }

    const nodes = sections[0];
    const connections = sections[1];

    let node_map = {};

    const node_data = nodes.split('\n');
    for (let node of node_data) {
        const data = node.split(/\s*\|\s*/);

        if (data === null || data.length != 4) {
            error("Invalid node format.");
            return new struct.Game();
        }

        const id = data[0];
        const type = data[1];
        const name = data[2];
        const desc = data[3];

        if (!struct.NodeTypes.includes(type)) {
            error("Invalid node type " + type);
            return new struct.Game();
        }
        
        node_map[id] = new struct.Node(name, desc, type, 0.0, 0.0);
    }
    
    let connection_data = connections.split('\n')
    for (let connection of connection_data) {
        if (connection === "") continue;

        let re = /^(\d*)\s*([^\s]*)\s*(\d*)\s*$/;
        let data = re.exec(connection);

        if (data === null || data.length != 4) {
            error("Invalid connection format.");
            return new struct.Game();
        }

        if (!(data[2] in c_funcs)) {
            error("Invalid connection type " + data[2]);
            return new struct.Game();
        }

        let node_a = node_map[data[1]];
        let node_b = node_map[data[3]];

        c_funcs[data[2]](node_a, node_b);
    }


    let out = new struct.Game();
    for (const [id, node] of Object.entries(node_map)) {
        out.add_node(node);
    }
    return out;
}
