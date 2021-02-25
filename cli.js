#!/usr/bin/env node

'use strict';

const inquire = require('inquirer');
const settings = require('./package.json');
const util = require('./src/util');

/**
 * @class OA
 */
class OA {

    /**
     * @param {Object} api Global API Settings Object
     * @param {string} api.url URL of OA API instance to interact with
     * @param {string} api.username OpenAddresses Username
     * @param {string} api.password OpenAddresses Password
     */
    constructor(api = {}) {
        this.url = api.url ? new URL(api.url).toString() : 'https://batch.openaddresses.io';

        this.user = {
            username: api.username ? api.username : process.env.OA_USERNAME,
            password: api.password ? api.password : process.env.OA_PASSWORD,
            token: api.token ? api.token : process.env.OA_TOKEN,
            secret: api.secret ? api.secret : process.env.OA_SECRET
        };

        this.schema = false;
    }

    async get_schema() {
        this.schema = await util.schema(this);
    }

    async api() {

    }
}

module.exports = OA;

// Run in CLI mode
if (require.main === module) {
    const argv = require('minimist')(process.argv, {
        boolean: ['help', 'version'],
        string: ['url', 'username', 'password'],
        alias: {
            version: 'v',
            help: '?'
        }
    });

    cli(argv);
}

async function cli(argv) {
    const oa = new OA(argv);

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

    await oa.get_schema();

    argv.cli = true;
}
