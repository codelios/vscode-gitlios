// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import { GitHistoryPanel } from './mywebview';
import { IGit, ICommitInfo, MyIsomorphicGit } from 'git-stat-common';
import { Config } from 'git-stat-common/lib/config';

const gitClient: IGit = new MyIsomorphicGit();

export function showGitHistory(extensionPath: string, gitRoot: string, fsPath: string) : void {
    GitHistoryPanel.createOrShow();
    GitHistoryPanel.currentPanel?.setBusy();
    const config: Config = new Config();
    gitClient.GetLogsForFile(config, gitRoot, fsPath).then(
        (commitInfo: ICommitInfo) => {
            GitHistoryPanel.currentPanel?.updateCommits(commitInfo);
        },
        err => {
            console.log(err);
        }
    );
}