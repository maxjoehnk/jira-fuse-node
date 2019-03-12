export interface JiraProjectModel {
    self: string;
    id: string;
    key: string;
    name: string;
}

export interface JiraIssueModel {
    id: string;
    self: string;
    key: string;
    fields: {
        description: string;
        summary: string;
    };
}