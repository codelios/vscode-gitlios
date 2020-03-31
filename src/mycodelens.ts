// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as vscode from 'vscode';
import { cmdShowGitHistoryStr } from './cmd';

export class MyCodeLensProvider {

    private extensionPath:string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    getCodeLens(document: vscode.TextDocument): (vscode.CodeLens | undefined) {
        let topRight = new vscode.Range(0, 0, 0, 0);
        const workspaceFolders =  vscode.workspace.workspaceFolders;
        if (workspaceFolders === undefined || workspaceFolders === null) {
            return undefined;
        }
        const docRoot = workspaceFolders[0].uri.fsPath;
        let c: vscode.Command = {
            command: cmdShowGitHistoryStr,
            title: `Show Git History`,
            arguments: [ this.extensionPath, docRoot, document.uri.fsPath ]
        };
        return new vscode.CodeLens(topRight, c);
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        if (document !== null && document !== undefined) {
            if (document.uri !== null && document.uri !== undefined) {
                const codeLens = this.getCodeLens(document);
                if (codeLens === null || codeLens === undefined) {
                    return null;
                }
                return new Promise(
                    resolve => {
                        resolve([codeLens]);
                    }
                );
            }
        }
        return null;
    }

    public resolveCodeLens?(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
        return codeLens;

    }

}


export function registerCodeLens(subscriptions: Array<vscode.Disposable>, extensionPath: string) {
    const allSelector: vscode.DocumentSelector = { scheme: 'file', language: '*' };
    const provider = new MyCodeLensProvider(extensionPath);
    subscriptions.push(vscode.languages.registerCodeLensProvider(allSelector, provider));
}