const font = 'Slant';
figlet.defaults({ fontPath: 'https://cdn.jsdelivr.net/npm/figlet/fonts' });
figlet.preloadFonts([font], ready);

const commands = {
    help() {
        typewriter(this, help, 20);
    },

    about() {
        const msg = [
        '',
        'Type "credits" to see the tools powering this terminal.'
        ].join('\n');

        typewriter(this, msg, 20);
    },

    credits() {
        const msg = [
        '',
        '🔧 Used libraries:',
        '* jQuery Terminal: https://terminal.jcubic.pl',
        '* Figlet.js: https://github.com/patorjk/figlet.js/',
        '* Isomorphic Lolcat: https://github.com/jcubic/isomorphic-lolcat',
        ''
        ].join('\n');

        typewriter(this, msg, 20);
    }
};

// Create filesystem
const fileSystem = {
  '/': {
    home: {
      jaydon: {
        Desktop: {'flag.txt': 'CTF{desktop_flag_discovery}'},
        Documents: {},
        Downloads: {},
        Pictures: {},
        '.hint': 'In case you forget the password, check the stylesheet, nobody will ever look there.'
    }
    
    },
    root: {
        'root.txt': 'FLAG{R00T_4CC3SS}'
    }
  }
};





// ls command
commands.ls = function(path = null) {
    // prevent root
    if (path === '/root' && !isRoot) {
        return typewriter(this, 'Permission Denied', 20);
    }
    const dir = getDirPointer();

    
    const showHidden = (path || '').trim() === '-la';

    // do not display .hint unless -la is used
    const files= Object.keys(dir).filter(name => showHidden || !name.startsWith('.'));

    typewriter(this , files.join('\n'), 20);
};

// cd command
commands.cd = function(path) {
    const dir = getDirPointer();

    if (path === '..') {
        if (currentDir.length > 0) {
            currentDir.pop();
            this.set_prompt(getPrompt());
        } else {
            typewriter(this, 'I did not want to program all of that...', 20);
        }
        return;
    }

    if (!isRoot && path === 'root') {
        return typewriter(this, 'If only it was that easy...', 20);
    }
    

    if (dir[path]) {
        currentDir.push(path);
        this.set_prompt(getPrompt());
    } else {
        typewriter(this, `cd: no such file or directory: ${path}`, 20);
    }
};


// cat command
commands.cat = function(file) {
    const dir = getDirPointer();

    if (!isRoot && file.startsWith('/root/')) {
        return typewriter(this, 'If only it was that easy...', 20);
    }
    if (dir[file]) { // if valid file, print contents
        typewriter(this, (dir[file]), 20);
    } else {
        typewriter(this, (`cat: ${file}: No such file`, 20));
    }
};

// whoami command
commands.whoami = async function() {
    const termRef = this;

    // Print a new blank line and get a safe reference to it
    termRef.echo('');
    const index = termRef.last_index();

    const parts = [
        { text: 'An employer', delay: 50 },
        { text: ' ... ', delay: 300 },
        { text: 'hopefully 👀', delay: 50 }
    ];

    let output = '';

    for (const part of parts) {
        for (const char of part.text) {
        output += char;
        termRef.update(index, output); // update the last printed line
        await new Promise(resolve => setTimeout(resolve, part.delay));
        }
    }

    termRef.echo(); // add a newline at the end for normal terminal flow
};
// su command...NO PEAKING unless you hate fun
let isRoot = false;
let askPassword = false;
let lastcommand = '';
commands.su = function(input) {
    if (!input || input.trim() === 'root') {
        askPassword = true;
        lastcommand = 'su';

        // ask for password
        this.read('Password: ', true).then(pass => {
            askPassword = false;
            lastcommand = '';
            // verify password
            if (pass.trim() === 'dreamer.') {
                isRoot = true;
                currentDir = ['root'];
                this.set_prompt(getPrompt());
            }
            else {
                return typewriter(this, '.....', 300).then(() => {
                    return typewriter(this, 'su: authentication failure', 20);
                });
            }
        });
        return;
    }
};

// exit root 
commands.exit = function() {
    if (isRoot) {
        isRoot = false;
        currentDir = ['home', 'jaydon'];
        this.set_prompt(getPrompt())
    }
    else {
        return typewriter(this, "Leaving so soon?", 20);
    };
};

// ps command
commands.ps = function() {
    const output = [
        'PID   TTY          TIME      CMD',
        '1135  pts/0        00:00:00  bash',
        '1292  pts/0        00:00:01  su',
        '1430  pts/0        00:00:02  nano',
        '1993  pts/0        00:00:00  Q1RGe3dhdGNoX3RoZV9wcm9jZXNzZXN9'
    ];
    typewriter(this, output.join('\n'), 20);
};
fileSystem['/'].proc = {
    '1993': {
        'flag.txt': 'CTF{watch_the_processes}'
    }
};



// pwd command - shoe current working directory path
// track users current path in an array
let currentDir = ['home','jaydon'];
commands.pwd = function() {
    const path = '/' + currentDir.join('/');
    // show ~ when in home path
    typewriter(this, path, 20);
};

// flag tracker and submit button -------------------------
let foundFlags = new Set();
const validFlags = new Set([
    'CTF{desktop_flag_discovery}',
    'FLAG{R00T_4CC3SS}', 
    'CTF{watch_the_processes}'
]);
const totalFlags = 3;

// updates flag tracker container
function updateFlagTracker() {
    $('#flag-tracker').text(`Flags Found: ${foundFlags.size}/${totalFlags}`);
}

// submit command for flags
commands.submit = function(input) {
    // display command function if no parameters are specified
    if (!input || !input.trim()) {
        return typewriter(this, 'Usage: submit CTF{your_flag_here}', 20);
    }
    
    const flag = input.trim();
    // validate and check for duplicates
    if (validFlags.has(flag)) {
        if (!foundFlags.has(flag)) {
            foundFlags.add(flag);
            updateFlagTracker();
            return typewriter(this, `${flag}\nNice! You have found ${foundFlags.size}/${totalFlags} flags!`, 20);

        } else {
            return typewriter(this, 'Flag has already been submitted!', 20);
        }
    }

    return typewriter(this, 'Not a valid flag. Maybe check the format?', 20);
};



const command_list = Object.keys(commands);
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
const formatted_list = command_list.map(cmd => `[[;#0ff;]${cmd}]`);
const help = `Available commands: ${formatter.format(formatted_list)}`;

// initialize terminal prompt
const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion: true,
    prompt: getPrompt
});


function ready() {
    const seed = rand(256);
    term.echo(() => rainbow(render('WELCOME'), seed));
    term.echo('[[;#0ff;]Welcome to my Capture the Flag Challenge. The goal is to navigate through this simulated system and collect hidden flags. Good luck and I hope you have fun!.\nThis project was made using jQuery Terminal. Type "credits" to view documentation.\nTo get started, type "help" into the terminal to view a list of commands.]\n',{
        typing: true,
        delay: 20
    })
    .resume();
}


function rainbow(string, seed) {
    return lolcat.rainbow((char, color) => {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function render(text) {
    const cols = term.cols();
    const lines = figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }).split('\n');

    // courtesy of github copilot on how to center Welcome message
    return lines.map(line => {
        const padding = Math.floor((cols - line.length) / 2);
        return ' '.repeat(Math.max(padding, 0)) + line;
    }).join('\n');
}


function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}
// gets current directory object from fileSystem
function getDirPointer() {
    return currentDir.reduce((ptr, folder) => ptr?.[folder], fileSystem['/']);
}


// simulate a kali linux terminal
function getPrompt() {
    let displayPath = '/' + currentDir.join('/');


    // have /home/jajer display as ~
    if (displayPath === '/home/jaydon') {
        displayPath = '~';
    }

    // convert paths inside of /home/jaydon to ~/Desktop
    else if (displayPath.startsWith('/home/jaydon/')) {
        displayPath = displayPath.replace('/home/jaydon', '~');
    }

    // make path bold and white
    const pathColor = isRoot ? '#fff' : 'white';
    const pathStyled = `[[b;${pathColor};]${displayPath}]`;

    if (isRoot) {
        return (
            `[[;#367BF0;]┌──(` +
            `[[;red;]root]` +
            `[[;red;]㉿]` +
            `[[;red;]CTF_Challenge]` +
            `[[;#367BF0;])]` +
            `[[;#367BF0;]-[${pathStyled}]]\n` +
            `[[;#367BF0;]└─]` +
            '[[;red;]# ]'
        );
    } else {
        return (
            `[[;#198388;]┌──(` +
            `[[;#367BF0;]jaydon]` +
            `[[;#367BF0;]㉿]` +
            `[[;#367BF0;]CTF_Challenge]` +
            `[[;#198388;])]` +
            `[[;#198388;]-[${pathStyled}]]\n` +
            `[[;#198388;]└─]` +
            '[[;#367BF0;]$ ]'
        );
    }
}


// typewriter function
term.typing_speed(20)
async function typewriter(term, text, delay = 30) {
    term.echo('');
    const index = term.last_index();
    let output = '';

    for (const char of text) {
        output += char;
        term.update(index, output);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

