export interface IFuseAttributes {
    mtime: Date;
    atime: Date;
    ctime: Date;
    nlink: number;
    size: number;
    mode: number;
    uid: number;
    gid: number;
}

export interface IFuseFilesystem {
    readdir?(path: string, cb: (exitCode: number, files?: string[]) => void): void | Promise<void>;
    getattr?(path: string, cb: (exitCode: number, attributes?: IFuseAttributes) => void): void | Promise<void>;
    fgetattr?(path: string, fd: number, cb: (exitCode: number, attributes?: IFuseAttributes) => void): void | Promise<void>;
    open?(path: string, flags: number, cb: (exitCode: number, fileDescriptor?: number) => void): void | Promise<void>;
    read?(path: string, fileDescriptor: number, buffer: Buffer, length: number, position: number, cb: (exitCode: number) => void): void | Promise<void>;
    access?(path: string, mode, cb);
    write?(path: string, fd: number, buffer: Buffer, length: number, position: number, cb);
    flush?(path: string, fd: number, cb);
    release?(path: string, fd: number, cb);
}
