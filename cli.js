#!/usr/bin/env node

'use strict';

const prompt = require('prompt');
const settings = require('./package.json');

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
        this.url = api.url ? new URL(api.url).toString() : 'http://localhost:5000';
        this.user = {
            username: api.username ? api.username : process.env.OA_USERNAME,
            password: api.password ? api.password : process.env.OA_PASSWORD,
            token: api.token ? api.token : process.env.OA_TOKEN,
            secret: api.secret ? api.secret : process.env.OA_SECRET
        };

        // Instantiate New Library Instances
        this._ = {
            schedule: new (require('./src/schedule'))(this)
        };
    }
}

module.exports = OA;

// Run in CLI mode
if (require.main === module) {
    const argv = require('minimist')(process.argv, {
        boolean: ['help', 'version'],
        alias: {
            version: 'v',
            help: '?'
        }
    });

    if (argv.version) {
        console.error('oa-cli@' + settings.version);
        process.exit(0);
    } else if (!argv._[2] || (!argv._[2] && argv.help) || argv._[2] === 'help') {
        console.error('');
        console.error('usage: cli.js <command> [--version] [--help]');
        console.error('');
        console.error('note: the --script flag can be applied to any mode to disable prompts');
        console.error('      when used the user is responsible for making sure they have all the');
        console.error('      correct flags');
        console.error('');
        console.error('<command>');
        console.error('    help                        Displays this message');
        console.error('');
        console.error('<options>');
        console.error('    --version                   Print the current version of the CLI');
        console.error('    --help                      Print a help message');
        console.error();
        process.exit(0);
    }

    const command = (err, oa) => {
        if (err) throw err;
        const command = argv._[2];
        const subcommand = argv._[3];

        if (command && !oa._[command]) {
            console.error();
            console.error(`"${command}" command not found!`);
            console.error();
            process.exit(1);
        } else if (command && subcommand && !oa._[command][subcommand]) {
            console.error();
            console.error(`"${command} ${subcommand}" command not found!`);
            console.error();
            process.exit(1);
        } else if (argv.help || !subcommand) {
            return oa._[command].help();
        }

        if (!argv.script) {
            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            prompt.get([{
                name: 'url',
                message: 'URL to connect to local or remote OA instance. Be sure to include the protocol and port number for local instances, e.g. \'http://localhost:8000\'',
                type: 'string',
                required: 'true',
                default: oa.url
            }], (err, res) => {
                if (err) throw err;
                oa.url = new URL(res.url).toString();
                argv.cli = true;

                return run();
            });
        } else {
            return run();
        }

        /**
         * Once OA instance is instantiated, run the requested command
         *
         * @private
         * @returns {undefined}
         */
        function run() {
            if (!subcommand) {
                oa[command](argv);
            } else {
                oa._[command][subcommand](argv);
            }
        }
    };

    command(null, new OA(argv));
}
