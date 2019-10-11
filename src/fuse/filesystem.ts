import { Service } from 'typedi';
import { IFuseAttributes, IFuseFilesystem } from '../contracts/filesystem';
import { JiraFilesystem } from '../filesystem/filesystem';
import * as debug from 'debug';
import { S_IFDIR, S_IFREG } from 'constants';
import { FileAttributes, FileMode } from '../filesystem/operations/get-attributes';

const d = debug('jira-fuse-node:fuse');

@Service()
export class JiraFuseFilesystem implements IFuseFilesystem {
    constructor(private jiraFs: JiraFilesystem) {
    }

    readdir = async (path: string, cb: (exitCode: number, files?: string[]) => void) => {
        d('readdir', path);

        try {
            const directories = await this.jiraFs.readdir(path);

            return cb(0, directories);
        }catch (err) {
            return cb(err.code);
        }
    };

    getattr = async (path: string, cb: (exitCode: number, attributes?: IFuseAttributes) => void) => {
        d('getattr', path);
        try {
            const attributes = await this.jiraFs.getattr(path);
            return cb(0, JiraFuseFilesystem.mapAttributes(attributes));
        }catch (err) {
            return cb(err.code);
        }
    };

    open = async (path: string, flags: number, cb: (exitCode: number, fileDescriptor?: number) => void) => {
        d('open', path, flags);
        return cb(0, 1);
    };

    read = async(path: string, fileDescriptor: number, buffer: Buffer, length: number, position: number, cb: (exitCode: number) => void) => {
        d('read', path, fileDescriptor, length, position);
        const res = await this.jiraFs.read(path);
        const str = res.slice(position, position + length);
        if (!str) {
            return cb(0);
        }
        buffer.write(str);
        console.log(res, res.length, position, length, buffer.length);
        return cb(str.length);
    };

    private static mapAttributes(attributes: FileAttributes): IFuseAttributes {
        return {
            atime: new Date(),
            mtime: new Date(),
            ctime: new Date(),
            nlink: attributes.mode === FileMode.Directory ? 2 : 1,
            size: attributes.size || 40,
            mode: JiraFuseFilesystem.mapMode(attributes),
            uid: process.getuid(),
            gid: process.getgid()
        };
    }

    private static mapMode(attributes: FileAttributes): number {
        if (attributes.mode === FileMode.Directory) {
            return S_IFDIR | 0o777;
        }
        return S_IFREG | 0o777;
    }
}