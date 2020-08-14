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
                name: 'event',
                message: 'type of event to fire',
                required: true,
                type: 'string',
                default: options.event
            }];

            prompt.get(args, (err, argv) => {
                prompt.stop();

                if (argv.hecate_username) {
                    self.api.user = {
                        username: argv.oa_username,
                        password: argv.oa_password
                    };
                }

                options.event = argv.event;

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
            if (!options.event) return cb(new Error('options.event required'));

            let url = new URL(`/api/schedule`, self.api.url);

            request({
                method: 'POST',
                url: url,
                auth: self.api.user,
                json: true,
                body: {
                    event: options.event
                }
            }, (err, res) => {
                if (err) return cb(err);
                if (res.statusCode !== 200) return cb(new Error(JSON.stringify(res.body)));

                return cb(res.body);
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
