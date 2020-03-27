// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import { GitHistoryPanel } from './mywebview';
import { IGit, ICommitInfo, MyIsomorphicGit } from 'git-stat-common';

const gitClient: IGit = new MyIsomorphicGit();

export function showGitHistory(fsPath: string) : Promise<Array<ICommitInfo>> {
    console.log(fsPath);
    GitHistoryPanel.createOrShow();
    return gitClient.GetLogs(fsPath);
}