const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todos = [];
for (let file of files) {
    file = file.split('\n');
    for (let line of file) {
        let ind = line.indexOf('// TODO');
        if (ind !== -1) {
            todos.push(line.slice(ind,));
        }
    }
}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getToDo();
            break;
        case 'important':
            getImportant();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getToDo() {
    for (let todo of todos) {
            console.log(todo);
        }
}

function getImportant(){
    for (let todo of todos) {
        if (todo.includes("!")) {
            console.log(todo);
        }
    }
}
