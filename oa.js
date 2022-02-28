#!/usr/bin/env node
'use strict';

const cli = require('./src/cli');
const settings = require('./package.json');
const util = require('./src/util');
const run = require('./src/run');
const inquire = require('inquirer');

const argv = require('minimist')(process.argv, {
    boolean: ['help', 'version', 'trace'],
    string: ['url', 'username', 'password'],
    alias: {
        version: 'v',
        help: '?'
    }
});


/**
 * @class
 * @param {Object} api Global API Settings Object
 * @param {string} api.url URL of OA API instance to interact with
 * @param {string} api.username OpenAddresses Username
 * @param {string} api.password OpenAddresses Password
 * @param {string} api.secret OpenAddresses SharedSecret
 * @param {string} api.token OpenAddresses Token
 */
class OA {
    constructor(api = {}) {
        this.url = api.url ? new URL(api.url).toString() : 'https://batch.openaddresses.io';

        this.user = {
            username: api.username ? api.username : process.env.OA_USERNAME,
            password: api.password ? api.password : process.env.OA_PASSWORD,
            token: api.token ? api.token : process.env.OA_TOKEN,
            secret: api.secret ? api.secret : process.env.OA_SECRET
        };

        this.schema = util.local_schema();
    }

    /**
     * Run an OpenAddresses Command
     *
     * @param {String} cmd - Command to run
     * @param {String} subcmd - Subcommand to run
     *
     * @param {Object} payload - Optional API Payload
     */
    async cmd(cmd, subcmd, payload = {}) {
        if (process.env.UPDATE) this.schema = await util.schema(this.url);

        if (!this.schema.cli[cmd]) throw new Error('Command Not Found');
        if (!this.schema.cli[cmd].cmds[subcmd]) throw new Error('Subcommand Not Found');
        if (!this.schema.schema[this.schema.cli[cmd].cmds[subcmd]]) throw new Error('API not found for Subcommand');

        let url = this.schema.cli[cmd].cmds[subcmd];
        const matches = url.match(/:[a-z]+/g);

        if (matches) {
            for (const match of matches) {
                if (argv.cli && !argv.script && matches.length) {
                    const res = await inquire.prompt([{
                        name: match,
                        message: `${match} to fetch`,
                        type: 'string',
                        required: 'true',
                        default: payload[match]
                    }]);

                    payload[match] = res[match];
                }

                if (!payload[match]) throw new Error(`"${match}" is required in body`);
                url = url.replace(match, payload[match]);
                delete payload[match];
            }
        }

        const schema = this.schema.schema[this.schema.cli[cmd].cmds[subcmd]];

        if (argv.cli && !argv.script && schema.body) {
            const body = (await util.schema(this.url, ...this.schema.cli[cmd][subcmd].split(' '))).body;

            for (const prop of Object.keys(body.properties)) {
                const p = body.properties[prop];

                const ask = {
                    name: prop,
                    message: `${prop} to populate`,
                    type: p.type,
                    required: 'true'
                };

                if (p.enum) {
                    ask.type = 'list';
                    ask.choices = p.enum;
                }

                const res = await inquire.prompt([ask]);
                payload[prop] = res[prop];

            }
        }

        return await run(this, schema, url, payload);
    }
}

module.exports = OA;

// Run in CLI mode
if (require.main === module) {
    runner(argv);
}

async function runner(argv) {
    if (argv.version) {
        console.log(`openaddresses/lib@${settings.version}`);
        return;
    }

    const oa = new OA(argv);

    if (argv.help || !argv._[2] || !argv._[3]) {
        return cli.help(argv, oa);
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
