// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as vscode from 'vscode';
import { cmdShowGitHistoryStr } from './cmd';

export class MyCodeLensProvider {


    getCodeLens(document: vscode.TextDocument): vscode.CodeLens {
        let topRight = new vscode.Range(0, 0, 0, 0);
        let c: vscode.Command = {
            command: cmdShowGitHistoryStr,
            title: `Show Git History`,
        };
        return new vscode.CodeLens(topRight, c);
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        if (document !== null && document !== undefined) {
            if (document.uri !== null && document.uri !== undefined) {
                const codeLens = this.getCodeLens(document);
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

const provider = new MyCodeLensProvider();

export function registerCodeLens(subscriptions: Array<vscode.Disposable>) {
    const allSelector: vscode.DocumentSelector = { scheme: 'file', language: '*' };
    subscriptions.push(vscode.languages.registerCodeLensProvider(allSelector, provider));
}