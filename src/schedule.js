#!/usr/bin/env node

'use strict';

const request = require('request');
const prompt = require('prompt');

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
     * @param {function} cb (err, res) style callback function
     *
     * @return {function} (err, res) style callback
     */
    fire(options = {}, cb) {
        const self = this;

        if (!options) options = {};

        if (options.script) {
            cb = cli;

            options.output = process.stdout;

            return main();
        } else if (options.cli) {
            cb = cli;

            prompt.message = '$';
            prompt.start({
                stdout: process.stderr
            });

            let args = [{
                name: 'type',
                message: 'type of event to fire',
                required: true,
                type: 'string',
                default: options.type
            }];

            prompt.get(args, (err, argv) => {
                prompt.stop();

                options.type = argv.type;

                return main();
            });
        } else {
            return main();
        }

        /**
         * Once the options object is populated, make the API request
         * @private
         *
         * @returns {undefined}
         */
        function main() {
            if (!options.type) return cb(new Error('options.type required'));

            let url = new URL(`/api/schedule`, self.api.url);

            const params = {
                method: 'POST',
                url: url,
                headers: {
                    'shared-secret': self.api.user.secret
                },
                json: true,
                body: {
                    type: options.type
                }
            };

            request(params, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(JSON.stringify(res.body)));

                return cb(null, res.body);
            });
        }

        /**
         * If in CLI mode, write results to stdout
         * or throw any errors incurred
         *
         * @private
         *
         * @param {Error} err [optional] API Error
         *
         * @returns {undefined}
         */
        function cli(err, body) {
            if (err) throw err;
            console.error(JSON.stringify(body, null, 4));
        }
    }
}

module.exports = Schedule;
