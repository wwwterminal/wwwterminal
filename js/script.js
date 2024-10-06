const terminal = document.getElementById('terminal');
let commandHistory = [];
let historyIndex = -1;

function addOutput(text) {
    const outputDiv = document.createElement('div');
    outputDiv.classList.add('command-output');
    outputDiv.textContent = text;
    terminal.appendChild(outputDiv);
    terminal.scrollTop = terminal.scrollHeight;
}

function addPrompt() {
    const promptDiv = document.createElement('div');
    promptDiv.classList.add('prompt-line');
    promptDiv.innerHTML = '<span class="prompt">$ </span><span class="input" contenteditable="true"></span>';
    terminal.appendChild(promptDiv);
    const inputElement = promptDiv.querySelector('.input');
    inputElement.focus();

    // Prevents multiple Enter event listeners being added
    inputElement.addEventListener('keydown', handleInput);
}

function handleInput(event) {
    const inputElement = event.target;
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = inputElement.textContent.trim();
        if (command) {
            processCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            inputElement.setAttribute('contenteditable', 'false');
            inputElement.removeEventListener('keydown', handleInput); // Remove listener after command submission
        }
    } else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            inputElement.textContent = commandHistory[historyIndex];
            moveCaretToEnd(inputElement);
        }
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputElement.textContent = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            inputElement.textContent = '';
        }
    }
}

function moveCaretToEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[0], el.textContent.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

const commands = {
    github: () => {
        window.location.href='https://github.com/wwwterminal/wwwterminal';
    },
    help: () => {
        window.location.href='list.html'
    },
    clear: () => {
        terminal.innerHTML = '';
        return '';
    },
    echo: (args) => args.join(' '),
    calc: (args) => {
        if (args.length !== 3) return "Usage: calc [num1] [operator] [num2]";
        const [num1, op, num2] = args;
        switch (op) {
            case '+': return Number(num1) + Number(num2);
            case '-': return Number(num1) - Number(num2);
            case '*': return Number(num1) * Number(num2);
            case '/': return Number(num1) / Number(num2);
            default: return "Invalid operator. Use +, -, *, or /";
        }
    },
    netcat: (args) => {
        if (args.length !== 1) return "Usage: netcat [uri]";
        window.location.href = args[0];
        return '';
    },
    helloworld: () => {
        return 'Hello world!';
    },
};

function processCommand(command) {
    const [cmd, ...args] = command.split(' ');
    const output = commands[cmd] ? commands[cmd](args) : `Command not found: ${cmd}`;
    if (output) addOutput(output);
    addPrompt();
}

window.onload = () => {
    addPrompt();
};
