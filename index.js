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

    const parts = command.split(' ');
    const baseCommand = parts[0].toLowerCase(); // основная команда в нижнем регистре
    const args = parts.slice(1);

    switch (baseCommand) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getToDo();
            break;
        case 'important':
            getImportant();
            break;
        case 'user':
            if (args.length === 0) {
                console.log('Нет имена пользователя');
            } else {
                const username = args.join(' ').toLowerCase();
                getByName(username);
            }
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

function getByName(n){
    for (let todo of todos) {
        if (todo.includes(";")) {
            let n_todo = todo.split(';');
            let name = n_todo[0].replace("// TODO ","");
            if (name === n){
                console.log(todo);
            }
        }
    }
}

function sortImportance(a, b){
    if (countExclamations(a) > countExclamations(b)) return 1;
    if (countExclamations(a) === countExclamations(b)) return 0;
    if (countExclamations(a) < countExclamations(b)) return -1;
}

function countExclamations(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '!') {
            count++;
        }
    }
    return count;
}

