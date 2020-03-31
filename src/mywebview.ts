// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as vscode from 'vscode';
import { ICommitInfo, ICommitEntry } from 'git-stat-common';

export class GitHistoryPanel {

	public static currentPanel: GitHistoryPanel | undefined;

    public static readonly viewType = 'gitHistory';

	private readonly _panel: vscode.WebviewPanel;

    private _disposables: vscode.Disposable[] = [];

    private commitInfo: ICommitInfo | null = null;

    private busy: boolean = false;

    public static createOrShow(extensionPath: string) {

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

    private getCommits(): string {
        if (this.commitInfo === undefined || this.commitInfo === null) {
            return ``;
        }
        var lines = [];
        for ( const commit of this.commitInfo.commits) {
            const committerName = this.commitInfo.commitDict.get(commit.committerID);
            lines.push(committerName + " " + (new Date(commit.committerTimestamp*1000)).toUTCString() + " " + commit.message);
        }
        return `<p>` + lines.join("</p><p>") + `</p`;
    }

    private getHTML(): string {
        let commitsHTML = ``;
        if (this.busy) {
            commitsHTML = `About to read and parse Git History Logs . This operation may take some time ..`;
        } else {
            commitsHTML = this.getCommits();
        }
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p>
            Git History for file
            </p>
        ` + commitsHTML + `
        </body>
        </html>`;

    }

    private _updateGitHistory(webview: vscode.Webview) {
        this._panel.title = 'Git History';
        this._panel.webview.html = this.getHTML();
    }

    public setBusy() {
        this.busy = true;
        this._update();
    }

    public updateCommits(commitInfo: ICommitInfo) {
        this.commitInfo = commitInfo;
        this.busy = false;
        this._update();
    }
}