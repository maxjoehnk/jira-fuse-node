import { Service } from 'typedi';
import { JiraReadDirOperation } from './operations/read-dir';
import { JiraReadFileOperation } from './operations/read-file';
import { FileAttributes, JiraGetAttributesOperation } from './operations/get-attributes';


@Service()
export class JiraFilesystem {
    constructor(private readDirOperation: JiraReadDirOperation,
                private readFileOperation: JiraReadFileOperation,
                private getAttributesOperation: JiraGetAttributesOperation) {
    }

    readdir(path: string): Promise<string[]> {
        return this.readDirOperation.execute(path);
    }

    read(path: string): Promise<string> {
        return this.readFileOperation.execute(path);
    }

    getattr(path: string): Promise<FileAttributes> {
        return this.getAttributesOperation.execute(path);
    }

}
