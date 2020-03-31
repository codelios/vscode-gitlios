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
    console.log(fsPath);
    GitHistoryPanel.createOrShow();
    GitHistoryPanel.currentPanel?.setBusy();
    const config: Config = new Config();
    gitClient.GetLogsForFile(config, gitRoot, fsPath).then(
        (commitInfo: ICommitInfo) => {
            GitHistoryPanel.currentPanel?.updateCommits(commitInfo);
            let count = 0;
            for (const commit of commitInfo.commits) {
                if (count < 5) {
                    console.log(commit.committerTimestamp + "  " + commit.message);
                }
                count++;
            }
            console.log("Inside mygit " + count + " commits");
        },
        err => {
            console.log(err);
        }
    );
}