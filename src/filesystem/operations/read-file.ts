import { Service } from 'typedi';
import { JiraClient } from '../../jira/client';
import { ENOENT } from 'constants';
import { ISSUE_DESCRIPTION_PATH } from '../path-parser';

@Service()
export class JiraReadFileOperation {
    constructor(private jiraClient: JiraClient) {
    }

    async execute(path: string): Promise<string> {
        if (ISSUE_DESCRIPTION_PATH.test(path)) {
            const parts = ISSUE_DESCRIPTION_PATH.exec(path);

            const project = parts[1];
            const issueKey = parts[2];

            const issue = await this.jiraClient.getIssue(project, issueKey);

            return issue.fields.description;
        }

        return Promise.reject({ code: ENOENT });
    }
}
