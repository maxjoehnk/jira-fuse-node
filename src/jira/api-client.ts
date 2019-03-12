import { JiraIssueModel, JiraProjectModel } from '../contracts/jira-client';
import { Service } from 'typedi';
const JiraApi = require('jira-client');
import IJiraApi from 'jira-client';
import * as debug from 'debug';
const config = require(process.cwd() + '/config.json');

const d = debug('jira-fuse-node:jira:api');

@Service()
export class JiraApiClient {
    private api: IJiraApi;

    constructor() {
        this.api = new JiraApi(config);
    }

    async listProjects(): Promise<JiraProjectModel[]> {
        d('listProjects');
        return await this.api.listProjects() as JiraProjectModel[];
    }

    async getIssuesForProject(project: string): Promise<JiraIssueModel[]> {
        d('getIssuesForProject', project);
        const res = await this.api.searchJira(`project=${project}`, {
            fields: [
                'status',
                'issuetype',
                'summary',
                'description'
            ],
            maxResults: 500
        });

        return res.issues;
    }

    async getIssue(issueKey: string): Promise<JiraIssueModel> {
        return await this.api.findIssue(issueKey) as JiraIssueModel;
    }
}