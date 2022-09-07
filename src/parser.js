import * as struct from "./structure.js"



export function parse(file) {
    let done = false;
    let error = false;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        done = true;
    };
    
    reader.onerror = function() {
        error = true;
        alert("Could not read file " + file.name);
        console.log(reader.error);
        done = true;
    };

    while (!done) {} // gosh I love JS

    if (error) {
        return new struct.Game();
    }

    console.log(reader.result)

    return new struct.Game();
}
