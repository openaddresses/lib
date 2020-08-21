#!/usr/bin/env node

'use strict';

const {auth} = require('./util');
const request = require('request');
const inquire = require('inquirer');

/**
 * @class Schedule
 * @public
 */
class Schedule {
    /**
     * Create a new Schedule Instance
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
        console.error('Immediately execute a normally scheduled event');
        console.error();
        console.error('Usage: cli.js schedule <subcommand>');
        console.error();
        console.error('<subcommand>:');
        console.error('    fire      Fire a scheduled event');
        console.error();
    }

    /**
     * Queries OA /api/schedule endpoint
     * Immediately execute a normally scheduled event
     *
     * @param {!Object} options Options for making a request
     * @param {string} [options.event] Type of event to fire
     *
     * @return {Promise}
     */
    async fire(options = {}) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            options.output = process.stdout;

            await main();
        } else if (options.cli) {
            const argv = await inquire.prompt([{
                name: 'type',
                message: 'type of event to fire',
                required: true,
                type: 'string',
                default: options.type
            }]);

            options.type = argv.type;

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
                if (!options.type) return cb(new Error('options.type required'));

                let url = new URL(`/api/schedule`, self.api.url);

                const params = auth({
                    method: 'POST',
                    url: url,
                    json: true,
                    body: {
                        type: options.type
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

module.exports = Schedule;
