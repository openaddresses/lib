#!/usr/bin/env node

'use strict';

const {auth} = require('./util');
const request = require('request');
const inquire = require('inquirer');

/**
 * @class Run
 * @public
 */
class Run {
    /**
     * Create a new Run Instance
     *
     * @param {OA} api parent OA instance
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Print help documentation about the subcommand to stderr
     */
    help() {
        console.error();
        console.error('Interact with runs');
        console.error();
        console.error('Usage: cli.js run <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error('    create      Create a new run');
        console.error('    populate    Populate an existing run');
        console.error();
    }

    /**
     * Creates a new run
     * Immediately execute a normally scheduled event
     *
     * @param {!Object} options Options for making a request
     * @param {string} [options.live] Is the run a live run
     *
     * @return {Promise}
     */
    async create(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            const argv = await inquire.prompt([{
                name: 'live',
                message: 'Is the run a live run',
                required: true,
                type: 'confirm',
                default: options.live
            }]);

            options.live = argv.live;

            try {
                const body = await main();
                console.log(JSON.stringify(body, null, 4));
            } catch (err) {
                console.error(err.message)
                process.exit(1);
            }
        } else {
            await main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {Promise}
         */
        function main() {
            return new Promise((resolve, reject) => {
                if (!options.live) return reject(new Error('options.live required'));

                let url = new URL(`/api/run`, self.api.url);

                const params = auth({
                    method: 'POST',
                    url: url,
                    json: true,
                    body: {
                        live: options.live
                    }
                }, self.api.user);

                request(params, (err, res) => {
                    if (err) return reject(err);
                    if (res.statusCode !== 200) return reject(new Error(JSON.stringify(res.body)));

                    return resolve(res.body);
                });
            });
        }
    }

    async populate(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            let argv = await inquire.prompt([{
                name: 'runid',
                message: 'ID of run to populate',
                required: true,
                type: 'string',
                default: options.runid
            }]);

            options.runid = argv.runid;

            options.sources = [];

            do {
                argv = await inquire.prompt([{
                    name: 'source',
                    message: 'Source URL to pull from',
                    required: true,
                    type: 'string',
                    default: options.source
                },{
                    name: 'layer',
                    message: 'Layer of source to pull from',
                    required: true,
                    type: 'string',
                    default: options.layer
                },{
                    name: 'name',
                    message: 'Name of Source Layer to pull from',
                    required: true,
                    type: 'string',
                    default: options.name
                },{
                    name: 'more',
                    message: 'Do you wish to add another source?',
                    required: true,
                    type: 'confirm',
                    default: options.more
                }]);

                options.sources.push({
                    source: argv.source,
                    layer: argv.layer,
                    name: argv.name
                });
            } while(argv.more)

            try {
                const body = await main();
                console.log(JSON.stringify(body, null, 4));
            } catch (err) {
                console.error(err.message)
                process.exit(1);
            }
        } else {
            await main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {Promise}
         */
        function main() {
            return new Promise((resolve, reject) => {
                if (!options.runid) return reject(new Error('options.runid required'));
                if (!options.sources) return reject(new Error('options.sources required'));

                let url = new URL(`/api/run/${options.runid}/jobs`, self.api.url);

                const params = auth({
                    method: 'POST',
                    url: url,
                    json: true,
                    body: {
                        jobs: options.sources
                    }
                }, self.api.user);

                request(params, (err, res) => {
                    if (err) return reject(err);
                    if (res.statusCode !== 200) return reject(new Error(JSON.stringify(res.body)));

                    return resolve(res.body);
                });
            });
        }
    }
}

module.exports = Run;
