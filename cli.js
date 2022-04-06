#!/usr/bin/env node

import inquire from 'inquirer';
import minimist from 'minimist';
import { readFile } from 'fs/promises';

import OA from './oa.js';
import help from './src/help.js';

const argv = minimist(process.argv, {
    boolean: ['help', 'version', 'trace'],
    string: ['url', 'username', 'password'],
    alias: {
        version: 'v',
        help: '?'
    }
});

runner(argv);

async function runner(argv) {
    if (argv.version) {
        const settings = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
        console.log(`openaddresses/lib@${settings.version}`);
        return;
    }

    const oa = new OA(argv);

    if (argv.help || !argv._[2] || !argv._[3]) {
        return help(argv, oa);
    }

    if (!argv.script) {
        const res = await inquire.prompt([{
            name: 'url',
            message: 'URL to connect to local or remote OA instance. Be sure to include the protocol and port number for local instances, e.g. \'http://localhost:8000\'',
            type: 'string',
            required: 'true',
            default: oa.url
        }]);

        oa.url = new URL(res.url).toString();
    }

    argv.cli = true;

    try {
        const res = await oa.cmd(argv._[2], argv._[3], argv);

        if (res instanceof Buffer) {
            process.stdout.write(res);
        } else {
            console.log(JSON.stringify(res, null, 4));
        }
    } catch (err) {
        if (argv.trace) throw err;

        console.error();
        console.error(err.message);
        console.error();
        process.exit(1);
    }
}
