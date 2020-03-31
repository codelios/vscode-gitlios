// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as vscode from 'vscode';
import { ICommitInfo } from 'git-stat-common';

export class GitHistoryPanel {

	public static currentPanel: GitHistoryPanel | undefined;

    public static readonly viewType = 'gitHistory';

	private readonly _panel: vscode.WebviewPanel;

	private _disposables: vscode.Disposable[] = [];

    public static createOrShow() {

		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
            : undefined;

		// If we already have a panel, show it.
		if (GitHistoryPanel.currentPanel) {
			GitHistoryPanel.currentPanel._panel.reveal(column);
			return;
        }

        const panel = vscode.window.createWebviewPanel(
            this.viewType,
            "Git History",
			vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

		GitHistoryPanel.currentPanel = new GitHistoryPanel(panel);
    }

	private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			(message: ICommitInfo) => {
                console.log(" Received " + message.commits.length + " commits");
			},
			null,
			this._disposables
        );

        this._update();
    }

	public dispose() {
		GitHistoryPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
        // Vary the webview's content based on where it is located in the editor.
        console.log(this._panel.viewColumn);
		switch (this._panel.viewColumn) {
			default:
				this._updateGitHistory(webview);
				return;
		}
    }

    private _updateGitHistory(webview: vscode.Webview) {
        this._panel.title = 'Git History';
        this._panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p>
            Crisper Git History
            </p>
        </body>
        </html>`;
    }

    public updateCommits(commitInfo: ICommitInfo) {
        console.log('Updating commits');
        this._panel.webview.postMessage(commitInfo);
    }
}