// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as vscode from 'vscode';
import { GitHistoryPanel } from './mywebview';

export const cmdShowGitHistoryStr = "gitlios.showGitHistory";

function cmdHelloWorld() {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
}

function cmdShowGitHistory() {
        GitHistoryPanel.createOrShow();
}

// The command has been defined in the package.json file
// Now provide the implementation of the command with registerCommand
// The commandId parameter must match the command field in package.json
export function registerCommands(subscriptions: Array<vscode.Disposable>) {
    subscriptions.push(vscode.commands.registerCommand('gitlios.helloWorld', cmdHelloWorld));
    subscriptions.push(vscode.commands.registerCommand(cmdShowGitHistoryStr, cmdShowGitHistory));
}

