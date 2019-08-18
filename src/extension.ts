
import * as vscode from 'vscode';
import * as path from 'path';
import { isUndefined } from 'util';

let g_terminal: vscode.Terminal;
let terminal_open: boolean = false;

export function activate(context: vscode.ExtensionContext) {

	console.log('Activating extension AMPL');

	let disposable_1 = vscode.commands.registerCommand('ampl.openConsole', openAMPLConsole);
	
	let disposable_2 = vscode.commands.registerCommand('ampl.runFile', () => {
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let document = editor.document;
		if (document.isUntitled) {
			document.save();
		}
		else {
			let ext = path.extname(document.fileName);
			if (ext == '.dat') {
				writeToConsole(`data "${document.fileName}";`);
			} else if (ext == '.mod') {
				writeToConsole(`model "${document.fileName}";`);
			} else if (ext == '.run') {
				writeToConsole(`include "${document.fileName}"`);
			}
		}
	});

	context.subscriptions.push(disposable_1);
	context.subscriptions.push(disposable_2);
	
	vscode.window.onDidCloseTerminal((terminal) => {
		if (terminal === g_terminal) {
			terminal_open = false;
		}
	});
	
	
}

export function openAMPLConsole() {
	openConsole();
	let path = vscode.workspace.getConfiguration('ampl').get<string>('pathToExecutable');
	if (path === "" || isUndefined(path)) {
		path = "ampl";
	}
	g_terminal.sendText(path);
}

function writeToConsole(msg: string) {
	if (!terminal_open) {
		openAMPLConsole();
	}
	g_terminal.sendText(msg);
}

function openConsole() {
	g_terminal = vscode.window.createTerminal({name: "AMPL"});
	terminal_open = true;
	g_terminal.show(true);
}