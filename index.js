const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todos = [];
for (let file of files) {
    if (file.startsWith('const {getAllFilePathsWithExtension, readFile} = require(\'./fileSystem\');')) {
        continue
    }
    file = file.split('\n');
    for (let line of file) {
        let ind = line.indexOf('// TODO');
        if (ind !== -1) {
            todos.push(line.slice(ind,));
        }
    }
}

let name_todos = []
for (let todo of todos) {
    if (todo.includes(";")) {
        name_todos.push(todo);
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
    const baseCommand = parts[0].toLowerCase();
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
        case 'sort':
            if (args.length === 0) {
                console.log('Нет параметра');
            } else {
                const param = args.join(' ');
                if (param === "importance") {
                    todos.sort(sortImportance);
                    newView(todos);
                }
                if (param === "user") {
                    name_todos.sort(sortName);
                    newView(name_todos);
                }
                if (param === "date") {
                    name_todos.sort(sortDate);
                    newView(name_todos);
                }
            }
            break;
        case 'date':
            if (args.length === 0) {
                console.log('нет параметров')
            }else{
                let result = []
                const param = args.join(' ');
                for (const name_todo of name_todos) {
                    const date = new Date(name_todo.split(";")[1].trimEnd());
                    if (date - parseDate(param) > 0){
                        result.push(name_todo)
                    }
                }
                newView(result);
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function getToDo() {
    for (let todo of todos) {
            console.log(newString(todo));
        }
}

function getImportant(){
    for (let todo of todos) {
        if (todo.includes("!")) {
            console.log(newString(todo));
        }
    }
}

function getByName(n){
    for (let todo of todos) {
        if (todo.includes(";")) {
            let n_todo = todo.split(';');
            let name = n_todo[0].replace("// TODO ","");
            if (name === n){
                console.log(newString(todo));
            }
        }
    }
}

function sortName(a, b){
    a = a.split(";")[0].replace("// TODO ","");
    b = b.split(";")[0].replace("// TODO ","");
    return (a.localeCompare(b));
}

function sortDate(a, b){
    a = a.split(";")[1].trimEnd();
    b = b.split(";")[1].trimEnd();
    return (new Date(b) - new Date(a));
}

function sortImportance(a, b){
    if (countExclamations(a) > countExclamations(b)) return -1;
    if (countExclamations(a) === countExclamations(b)) return 0;
    if (countExclamations(a) < countExclamations(b)) return 1;
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

function newString(commentString) {
    let str = commentString.trim();
    str = str.replace("// TODO ", '');

    const parts = str.split(';', 3);
    while (parts.length < 3) parts.push('');

    const author = parts[0].trim();
    const date = parts[1].trim();
    const text = parts[2].trim();

    const hasExclamation = text.includes('!');
    const firstCol = hasExclamation ? '!' : '';

    const truncate = (s, maxWidth) => {
        if (s.length <= maxWidth) return s;
        if (maxWidth <= 3) return s.slice(0, maxWidth);
        return s.slice(0, maxWidth - 3) + '...';
    };

    const authorCol = truncate(author, 10);
    const dateCol = truncate(date, 10);
    const textCol = truncate(text, 50);

    return firstCol.padEnd(1) + '  |  ' +
        authorCol.padEnd(10) + '  |  ' +
        dateCol.padEnd(10) + '  |  ' +
        textCol.padEnd(50);
}

function newView(commentsArray) {
    let newCom = commentsArray.map(newString)
    for (let comment of newCom) {
        if (comment === undefined) {
            continue;
        }
        console.log(comment);
    }
}

function parseDate(dateString) {
    const parts = dateString.split('-').map(Number);

    const year = parts[0];
    const month = parts.length >= 2 ? parts[1] - 1 : 0;
    const day = parts.length >= 3 ? parts[2] : 1;

    return new Date(year, month, day);
}