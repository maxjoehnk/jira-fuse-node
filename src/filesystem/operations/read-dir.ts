import { Service } from 'typedi';
import { JiraClient } from '../../jira/client';
import { ISSUE_PATH, ISSUES_PATH, PROJECT_PATH } from '../path-parser';

@Service()
export class JiraReadDirOperation {
    constructor(private jiraClient: JiraClient) {
    }

    async execute(path: string): Promise<string[]> {
        if (path === '/') {
            return this.getRoot();
        }

        if (PROJECT_PATH.test(path)) {
            return ['issues'];
        }

        if (ISSUES_PATH.test(path)) {
            const project = ISSUES_PATH.exec(path)[1];
            return this.getProjectIssues(project);
        }

        if (ISSUE_PATH.test(path)) {
            return [
                'summary',
                'description'
            ]
        }

        return [];
    }

    private async getRoot(): Promise<string[]> {
        const projects = await this.jiraClient.listProjects();

        return projects.map(project => project.key);
    }

    private async getProjectIssues(project: string): Promise<string[]> {
        const issues = await this.jiraClient.listIssues(project);

        return issues.map(({ key }) => key);
    }
}
