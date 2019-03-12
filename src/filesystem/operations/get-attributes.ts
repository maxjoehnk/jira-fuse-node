import { Service } from 'typedi';
import { JiraClient } from '../../jira/client';
import { ISSUE_DESCRIPTION_PATH, ISSUE_PATH, ISSUES_PATH, PROJECT_PATH } from '../path-parser';
import { ENOENT } from 'constants';

export enum FileMode {
    File,
    Directory
}

export interface FileAttributes {
    mode: FileMode;
    size?: number;
}

@Service()
export class JiraGetAttributesOperation {
    constructor(private jiraClient: JiraClient) {
    }

    async execute(path: string): Promise<FileAttributes> {
        if (path === '/' ||
            PROJECT_PATH.test(path) ||
            ISSUES_PATH.test(path) ||
            ISSUE_PATH.test(path)) {
            return {
                mode: FileMode.Directory
            };
        }

        if (ISSUE_DESCRIPTION_PATH.test(path)) {
            const parts = ISSUE_DESCRIPTION_PATH.exec(path);

            const project = parts[1];
            const issueKey = parts[2];

            const issue = await this.jiraClient.getIssue(project, issueKey);

            return {
                mode: FileMode.File,
                size: issue.fields.description.length
            };
        }

        return Promise.reject({ code: ENOENT });
    }
}
