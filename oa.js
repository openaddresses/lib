import util from './src/util.js';
import { local_schema } from './src/util.js';
import run from './src/run.js';
import inquire from 'inquirer';

/**
 * @class
 * @param {Object} api Global API Settings Object
 * @param {string} api.url URL of OA API instance to interact with
 * @param {string} api.username OpenAddresses Username
 * @param {string} api.password OpenAddresses Password
 * @param {string} api.secret OpenAddresses SharedSecret
 * @param {string} api.token OpenAddresses Token
 */
export default class OA {
    constructor(api = {}) {
        this.url = api.url ? new URL(api.url).toString() : 'https://batch.openaddresses.io';

        this.user = {
            username: api.username ? api.username : process.env.OA_USERNAME,
            password: api.password ? api.password : process.env.OA_PASSWORD,
            token: api.token ? api.token : process.env.OA_TOKEN,
            secret: api.secret ? api.secret : process.env.OA_SECRET
        };

        this.schema = local_schema();

        this.argv = api;
    }

    /**
     * Run an OpenAddresses Command
     *
     * @param {String} cmd - Command to run
     * @param {String} subcmd - Subcommand to run
     *
     * @param {Object} defaults - Optional API Payload Defaults
     */
    async cmd(cmd, subcmd, defaults = {}) {
        if (process.env.UPDATE) this.schema = await util.schema(this.url);

        if (!this.schema.cli[cmd]) throw new Error('Command Not Found');
        if (!this.schema.cli[cmd].cmds[subcmd]) throw new Error('Subcommand Not Found');
        if (!this.schema.schema[this.schema.cli[cmd].cmds[subcmd]]) throw new Error('API not found for Subcommand');

        const payload = {};

        let url = this.schema.cli[cmd].cmds[subcmd];
        const matches = url.match(/:[a-z]+/g);

        if (matches) {
            for (const match of matches) {
                if (this.argv.cli && !this.argv.script && matches.length) {
                    const res = await inquire.prompt([{
                        name: match,
                        message: `${match} to fetch`,
                        type: 'string',
                        required: 'true',
                        default: defaults[match]
                    }]);

                    payload[match] = res[match];
                } else {
                    payload[match] = defaults[match]
                }

                if (!payload[match]) throw new Error(`"${match}" is required in body`);
                url = url.replace(match, payload[match]);
                delete payload[match];
            }
        }

        const schema = this.schema.schema[this.schema.cli[cmd].cmds[subcmd]];

        if (this.argv.cli && !this.argv.script && schema.body) {
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
