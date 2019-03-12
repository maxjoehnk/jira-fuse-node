import { Service } from 'typedi';
import { JiraIssueModel, JiraProjectModel } from '../contracts/jira-client';
import { JiraApiClient } from './api-client';
import * as debug from 'debug';

const d = debug('jira-fuse-node:jira:cache');

@Service()
export class JiraCache {
    private projectKeys: string[] = [];
    private projectMap: {
        [projectKey: string]: JiraProjectModel
    } = {};
    private issues: {
        [project: string]: JiraIssueModel[]
    } = {};

    private projectsCached = false;
    private issuesCached: {
        [projectKey: string]: boolean
    } = {};

    constructor(private jiraApi: JiraApiClient) {}

    async refreshCache() {
        d('refreshing cache');
        await this.cacheProjects();
        await this.cacheIssues();
    }

    private async cacheProjects() {
        d('caching projects');
        const projects = await this.jiraApi.listProjects();
        this.projectKeys = projects.map(p => p.key);

        for (const project of projects) {
            this.projectMap[project.key] = project;
        }
        this.projectsCached = true;
    }

    private async cacheIssues() {
        d('caching issues');
        for (const projectKey of this.projectKeys) {
            this.issues[projectKey] = await this.jiraApi.getIssuesForProject(projectKey);
            this.issuesCached[projectKey] = true;
        }
    }

    projectsAvailable(): boolean {
        return this.projectsCached;
    }

    projectIssuesAvailable(project: string): boolean {
        return this.issuesCached[project];
    }

    get projects(): JiraProjectModel[] {
        return this.projectKeys.map(key => this.projectMap[key]);
    }

    getIssues(project: string): JiraIssueModel[] {
        return this.issues[project];
    }

    getIssue(project: string, issue: string): JiraIssueModel {
        return this.issues[project].find(i => i.key === issue);
    }
}