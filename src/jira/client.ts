import { Service } from 'typedi';
import { JiraCache } from './cache';
import { JiraIssueModel, JiraProjectModel } from '../contracts/jira-client';
import { JiraApiClient } from './api-client';

@Service()
export class JiraClient {
    constructor(private cache: JiraCache,
                private apiClient: JiraApiClient) {}

    async listProjects(): Promise<JiraProjectModel[]> {
        if (this.cache.projectsAvailable()) {
            return this.cache.projects;
        }
        return this.apiClient.listProjects();
    }

    async listIssues(project: string): Promise<JiraIssueModel[]> {
        if (this.cache.projectIssuesAvailable(project)) {
            return this.cache.getIssues(project);
        }
        return this.apiClient.getIssuesForProject(project);
    }

    async getIssue(project: string, issue: string): Promise<JiraIssueModel> {
        if (this.cache.projectIssuesAvailable(project)) {
            return this.cache.getIssue(project, issue);
        }
        return this.apiClient.getIssue(issue);
    }
}