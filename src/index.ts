import 'reflect-metadata';
import { Container } from 'typedi';
import { JiraFuseFilesystem } from './fuse/filesystem';
import { JiraCache } from './jira/cache';
import { build } from 'async-service-builder';
const fuse = require('fuse-bindings');

const CACHE_INTERVAL = 5 * 60 * 1000;

const fs = Container.get<JiraFuseFilesystem>(JiraFuseFilesystem);
const cache = Container.get<JiraCache>(JiraCache);

const cachingService = build(() => cache.refreshCache(), CACHE_INTERVAL);

const mountPath = '/tmp/jira-fuse/jira';

fuse.mount(mountPath, fs, err => {
    if (err) {
        console.error('error mounting', err);
    }
});

cachingService();

process.on('exit', () => {
    fuse.unmount(mountPath, (err) => {
        if (err) {
            console.error('error unmounting', err);
        }
    });
});